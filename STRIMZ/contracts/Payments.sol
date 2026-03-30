// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Interfaces/IERC20.sol";

/**
 * @title StrimzPayments
 * @notice Core payment router for Strimz - "Stripe for USDC"
 * @dev Pull-based payment model using ERC20 approve + transferFrom
 */
contract StrimzPayments {

    // ========================================================================
    // State
    // ========================================================================

    address public owner;
    address public feeCollector;

    mapping(address => bool) public supportedTokens;

    uint256 public protocolFeeBps;
    uint256 public constant MAX_FEE_BPS = 500;
    uint256 public constant BPS_DENOMINATOR = 10000;

    bool private locked;

    // ========================================================================
    // Merchant Registry
    // ========================================================================

    struct Merchant {
        address wallet;
        string name;
        bool active;
        uint256 totalVolume;
        uint256 customFeeBps;
        uint256 registeredAt;
    }

    mapping(bytes32 => Merchant) public merchants;
    mapping(address => bytes32) public walletToMerchant;
    uint256 public merchantCount;

    // ========================================================================
    // Subscriptions
    // ========================================================================

    enum SubscriptionStatus { Active, Paused, Cancelled }
    enum Interval { Weekly, Monthly, Quarterly, Yearly }

    struct Subscription {
        bytes32 id;
        address subscriber;
        bytes32 merchantId;
        address token;
        uint256 amount;
        Interval interval;
        SubscriptionStatus status;
        uint256 createdAt;
        uint256 lastChargeAt;
        uint256 nextChargeAt;
        uint256 chargeCount;
    }

    mapping(bytes32 => Subscription) public subscriptions;
    mapping(address => bytes32[]) public userSubscriptions;
    mapping(bytes32 => bytes32[]) public merchantSubscriptions;

    // ========================================================================
    // Payment Records
    // ========================================================================

    struct Payment {
        bytes32 id;
        address payer;
        bytes32 merchantId;
        address token;
        uint256 amount;
        uint256 fee;
        uint256 timestamp;
        bytes32 subscriptionId;
        string preference;
    }

    mapping(bytes32 => Payment) public payments;
    uint256 public paymentNonce;

    // ========================================================================
    // Events (slimmed to avoid stack depth issues)
    // ========================================================================

    event MerchantRegistered(bytes32 indexed merchantId, address indexed wallet, string name);
    event MerchantUpdated(bytes32 indexed merchantId, address wallet, bool active);

    event PaymentProcessed(
        bytes32 indexed paymentId,
        address indexed payer,
        bytes32 indexed merchantId,
        uint256 amount,
        uint256 fee
    );

    event SubscriptionCreated(
        bytes32 indexed subscriptionId,
        address indexed subscriber,
        bytes32 indexed merchantId,
        uint256 amount,
        Interval interval
    );

    event SubscriptionCharged(
        bytes32 indexed subscriptionId,
        bytes32 indexed paymentId,
        uint256 amount
    );

    event SubscriptionStatusChanged(
        bytes32 indexed subscriptionId,
        SubscriptionStatus status
    );

    event TokenSupported(address indexed token, bool supported);
    event FeeUpdated(uint256 newFeeBps);

    // ========================================================================
    // Modifiers
    // ========================================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");
        _;
    }

    modifier noReentrant() {
        require(!locked, "REENTRANCY");
        locked = true;
        _;
        locked = false;
    }

    modifier validMerchant(bytes32 merchantId) {
        require(merchants[merchantId].active, "MERCHANT_NOT_ACTIVE");
        _;
    }

    modifier validToken(address token) {
        require(supportedTokens[token], "TOKEN_NOT_SUPPORTED");
        _;
    }

    // ========================================================================
    // Constructor
    // ========================================================================

    constructor(address _feeCollector, uint256 _protocolFeeBps) {
        require(_feeCollector != address(0), "INVALID_FEE_COLLECTOR");
        require(_protocolFeeBps <= MAX_FEE_BPS, "FEE_TOO_HIGH");

        owner = msg.sender;
        feeCollector = _feeCollector;
        protocolFeeBps = _protocolFeeBps;
    }

    // ========================================================================
    // Merchant Management
    // ========================================================================

    function registerMerchant(
        address wallet,
        string calldata name
    ) external returns (bytes32 merchantId) {
        require(wallet != address(0), "INVALID_WALLET");
        require(bytes(name).length > 0, "INVALID_NAME");
        require(walletToMerchant[wallet] == bytes32(0), "WALLET_ALREADY_REGISTERED");

        merchantCount++;
        merchantId = keccak256(abi.encodePacked(wallet, name, block.timestamp, merchantCount));

        merchants[merchantId] = Merchant({
            wallet: wallet,
            name: name,
            active: true,
            totalVolume: 0,
            customFeeBps: 0,
            registeredAt: block.timestamp
        });

        walletToMerchant[wallet] = merchantId;
        emit MerchantRegistered(merchantId, wallet, name);
    }

    function updateMerchant(
        bytes32 merchantId,
        address newWallet,
        bool active
    ) external {
        Merchant storage m = merchants[merchantId];
        require(msg.sender == m.wallet || msg.sender == owner, "UNAUTHORIZED");
        require(newWallet != address(0), "INVALID_WALLET");

        if (newWallet != m.wallet) {
            delete walletToMerchant[m.wallet];
            walletToMerchant[newWallet] = merchantId;
            m.wallet = newWallet;
        }

        m.active = active;
        emit MerchantUpdated(merchantId, newWallet, active);
    }

    function setMerchantFee(bytes32 merchantId, uint256 feeBps) external onlyOwner {
        require(feeBps <= MAX_FEE_BPS, "FEE_TOO_HIGH");
        merchants[merchantId].customFeeBps = feeBps;
    }

    // ========================================================================
    // Internal helpers (extracted to reduce stack depth)
    // ========================================================================

    function _getFee(bytes32 merchantId, uint256 amount) internal view returns (uint256) {
        uint256 bps = merchants[merchantId].customFeeBps > 0
            ? merchants[merchantId].customFeeBps
            : protocolFeeBps;
        return (amount * bps) / BPS_DENOMINATOR;
    }

    function _generatePaymentId(address payer, bytes32 merchantId) internal returns (bytes32) {
        paymentNonce++;
        return keccak256(abi.encodePacked(payer, merchantId, paymentNonce));
    }

    // ========================================================================
    // One-Time Payments
    // ========================================================================

    function pay(
        bytes32 merchantId,
        address token,
        uint256 amount,
        string calldata preference
    ) external noReentrant validMerchant(merchantId) validToken(token) returns (bytes32) {
        require(amount > 0, "INVALID_AMOUNT");

        uint256 fee = _getFee(merchantId, amount);

        require(
            IERC20(token).transferFrom(msg.sender, merchants[merchantId].wallet, amount - fee),
            "MERCHANT_TRANSFER_FAILED"
        );

        if (fee > 0) {
            require(
                IERC20(token).transferFrom(msg.sender, feeCollector, fee),
                "FEE_TRANSFER_FAILED"
            );
        }

        bytes32 paymentId = _generatePaymentId(msg.sender, merchantId);

        payments[paymentId] = Payment({
            id: paymentId,
            payer: msg.sender,
            merchantId: merchantId,
            token: token,
            amount: amount,
            fee: fee,
            timestamp: block.timestamp,
            subscriptionId: bytes32(0),
            preference: preference
        });

        merchants[merchantId].totalVolume += amount;

        emit PaymentProcessed(paymentId, msg.sender, merchantId, amount, fee);

        return paymentId;
    }

    // ========================================================================
    // Subscriptions
    // ========================================================================

    function createSubscription(
        bytes32 merchantId,
        address token,
        uint256 amount,
        Interval interval
    ) external noReentrant validMerchant(merchantId) validToken(token) returns (bytes32) {
        require(amount > 0, "INVALID_AMOUNT");

        bytes32 subscriptionId = keccak256(
            abi.encodePacked(msg.sender, merchantId, amount, block.timestamp, userSubscriptions[msg.sender].length)
        );

        subscriptions[subscriptionId] = Subscription({
            id: subscriptionId,
            subscriber: msg.sender,
            merchantId: merchantId,
            token: token,
            amount: amount,
            interval: interval,
            status: SubscriptionStatus.Active,
            createdAt: block.timestamp,
            lastChargeAt: block.timestamp,
            nextChargeAt: _calculateNextCharge(block.timestamp, interval),
            chargeCount: 0
        });

        userSubscriptions[msg.sender].push(subscriptionId);
        merchantSubscriptions[merchantId].push(subscriptionId);

        emit SubscriptionCreated(subscriptionId, msg.sender, merchantId, amount, interval);

        _chargeSubscription(subscriptionId);

        return subscriptionId;
    }

    function chargeSubscription(bytes32 subscriptionId) external noReentrant {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.status == SubscriptionStatus.Active, "SUBSCRIPTION_NOT_ACTIVE");
        require(block.timestamp >= sub.nextChargeAt, "SUBSCRIPTION_NOT_DUE");

        _chargeSubscription(subscriptionId);
    }

    function batchChargeSubscriptions(bytes32[] calldata subscriptionIds) external noReentrant {
        for (uint256 i = 0; i < subscriptionIds.length; i++) {
            Subscription storage sub = subscriptions[subscriptionIds[i]];
            if (
                sub.status == SubscriptionStatus.Active &&
                block.timestamp >= sub.nextChargeAt
            ) {
                try this._chargeSubscriptionExternal(subscriptionIds[i]) {} catch {}
            }
        }
    }

    function _chargeSubscriptionExternal(bytes32 subscriptionId) external {
        require(msg.sender == address(this), "INTERNAL_ONLY");
        _chargeSubscription(subscriptionId);
    }

    function pauseSubscription(bytes32 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(msg.sender == sub.subscriber, "UNAUTHORIZED");
        require(sub.status == SubscriptionStatus.Active, "NOT_ACTIVE");

        sub.status = SubscriptionStatus.Paused;
        emit SubscriptionStatusChanged(subscriptionId, SubscriptionStatus.Paused);
    }

    function resumeSubscription(bytes32 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(msg.sender == sub.subscriber, "UNAUTHORIZED");
        require(sub.status == SubscriptionStatus.Paused, "NOT_PAUSED");

        sub.status = SubscriptionStatus.Active;
        sub.nextChargeAt = _calculateNextCharge(block.timestamp, sub.interval);
        emit SubscriptionStatusChanged(subscriptionId, SubscriptionStatus.Active);
    }

    function cancelSubscription(bytes32 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        Merchant storage merchant = merchants[sub.merchantId];
        require(
            msg.sender == sub.subscriber || msg.sender == merchant.wallet || msg.sender == owner,
            "UNAUTHORIZED"
        );

        sub.status = SubscriptionStatus.Cancelled;
        emit SubscriptionStatusChanged(subscriptionId, SubscriptionStatus.Cancelled);
    }

    function updateSubscriptionAmount(bytes32 subscriptionId, uint256 newAmount) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(msg.sender == sub.subscriber, "UNAUTHORIZED");
        require(newAmount > 0, "INVALID_AMOUNT");

        sub.amount = newAmount;
    }

    // ========================================================================
    // Internal
    // ========================================================================

    function _chargeSubscription(bytes32 subscriptionId) internal {
        Subscription storage sub = subscriptions[subscriptionId];
        uint256 fee = _getFee(sub.merchantId, sub.amount);

        require(
            IERC20(sub.token).transferFrom(sub.subscriber, merchants[sub.merchantId].wallet, sub.amount - fee),
            "CHARGE_FAILED"
        );

        if (fee > 0) {
            require(
                IERC20(sub.token).transferFrom(sub.subscriber, feeCollector, fee),
                "FEE_FAILED"
            );
        }

        bytes32 paymentId = _generatePaymentId(sub.subscriber, sub.merchantId);

        payments[paymentId] = Payment({
            id: paymentId,
            payer: sub.subscriber,
            merchantId: sub.merchantId,
            token: sub.token,
            amount: sub.amount,
            fee: fee,
            timestamp: block.timestamp,
            subscriptionId: subscriptionId,
            preference: ""
        });

        sub.lastChargeAt = block.timestamp;
        sub.nextChargeAt = _calculateNextCharge(block.timestamp, sub.interval);
        sub.chargeCount++;

        merchants[sub.merchantId].totalVolume += sub.amount;

        emit SubscriptionCharged(subscriptionId, paymentId, sub.amount);
    }

    function _calculateNextCharge(uint256 from, Interval interval) internal pure returns (uint256) {
        if (interval == Interval.Weekly) return from + 7 days;
        if (interval == Interval.Monthly) return from + 30 days;
        if (interval == Interval.Quarterly) return from + 90 days;
        if (interval == Interval.Yearly) return from + 365 days;
        revert("INVALID_INTERVAL");
    }

    // ========================================================================
    // Admin
    // ========================================================================

    function setSupportedToken(address token, bool supported) external onlyOwner {
        supportedTokens[token] = supported;
        emit TokenSupported(token, supported);
    }

    function setProtocolFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= MAX_FEE_BPS, "FEE_TOO_HIGH");
        protocolFeeBps = newFeeBps;
        emit FeeUpdated(newFeeBps);
    }

    function setFeeCollector(address _feeCollector) external onlyOwner {
        require(_feeCollector != address(0), "INVALID_ADDRESS");
        feeCollector = _feeCollector;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "INVALID_ADDRESS");
        owner = newOwner;
    }

    // ========================================================================
    // View Functions
    // ========================================================================

    function getUserSubscriptions(address user) external view returns (bytes32[] memory) {
        return userSubscriptions[user];
    }

    function getMerchantSubscriptions(bytes32 merchantId) external view returns (bytes32[] memory) {
        return merchantSubscriptions[merchantId];
    }

    function getSubscriptionDetails(bytes32 subscriptionId) external view returns (Subscription memory) {
        return subscriptions[subscriptionId];
    }

    function getPaymentDetails(bytes32 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    function getMerchantDetails(bytes32 merchantId) external view returns (Merchant memory) {
        return merchants[merchantId];
    }

    function isSubscriptionDue(bytes32 subscriptionId) external view returns (bool) {
        Subscription memory sub = subscriptions[subscriptionId];
        return sub.status == SubscriptionStatus.Active && block.timestamp >= sub.nextChargeAt;
    }

    function getEffectiveFee(bytes32 merchantId) external view returns (uint256) {
        uint256 custom = merchants[merchantId].customFeeBps;
        return custom > 0 ? custom : protocolFeeBps;
    }
}