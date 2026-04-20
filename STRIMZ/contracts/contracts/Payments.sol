// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

using SafeERC20 for IERC20;

/**
 * @title StrimzPayments
 * @notice Core payment router for Strimz - "Stripe for USDC"
 * @dev Pull-based payment model using ERC20 approve + transferFrom
 */
contract StrimzPayments is ReentrancyGuard {
    // ========================================================================
    // State
    // ========================================================================

    address public owner;
    address public feeCollector;
    address public pendingOwner;

    mapping(address => bool) public supportedTokens;

    uint256 public protocolFeeBps;
    uint256 public constant MAX_FEE_BPS = 500;
    uint256 public constant BPS_DENOMINATOR = 10000;

    mapping(bytes32 => address) public pendingWallet;

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

    enum SubscriptionStatus {
        Active,
        Paused,
        Cancelled
    }
    enum Interval {
        Weekly,
        Monthly,
        Quarterly,
        Yearly
    }

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
    mapping(bytes32 => mapping(address => uint256)) public userSubscriptionIndex;
    mapping(bytes32 => mapping(bytes32 => uint256)) public merchantSubscriptionIndex;

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

    event MerchantRegistered(
        bytes32 indexed merchantId,
        address indexed wallet,
        string name
    );
    event MerchantUpdated(
        bytes32 indexed merchantId,
        address wallet,
        bool active
    );
    event MerchantWalletUpdateInitiated(
        bytes32 indexed merchantId,
        address indexed newWallet
    );
    event MerchantWalletUpdateConfirmed(
        bytes32 indexed merchantId,
        address indexed newWallet
    );

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
    event MerchantFeeUpdated(bytes32 indexed merchantId, uint256 feeBps);
    event BatchChargeFailed(bytes32 indexed subscriptionId, string reason);
    event MerchantWalletUpdateCancelled(bytes32 indexed merchantId);

    // ========================================================================
    // Modifiers
    // ========================================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");
        _;
    }

    modifier validMerchant(bytes32 merchantId) {
        require(merchants[merchantId].active, "MERCHANT_NOT_ACTIVE");
        _;
    }

    modifier validToken(address token) {
        require(supportedTokens[token], "TOKEN_NOT_SUPPORTED");
        _;
    }

    modifier merchantExists(bytes32 merchantId) {
        require(merchants[merchantId].registeredAt != 0, "MERCHANT_NOT_FOUND");
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
        require(msg.sender == wallet, "MUST_REGISTER_SELF");
        require(bytes(name).length > 0, "INVALID_NAME");
        require(
            walletToMerchant[wallet] == bytes32(0),
            "WALLET_ALREADY_REGISTERED"
        );

        merchantCount++;
        merchantId = keccak256(
            abi.encodePacked(wallet, name, block.timestamp, merchantCount)
        );

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

    function registerMerchantFor(
        address wallet,
        string calldata name
    ) external onlyOwner returns (bytes32 merchantId) {
        require(wallet != address(0), "INVALID_WALLET");
        require(bytes(name).length > 0, "INVALID_NAME");
        require(
            walletToMerchant[wallet] == bytes32(0),
            "WALLET_ALREADY_REGISTERED"
        );

        merchantCount++;
        merchantId = keccak256(
            abi.encodePacked(wallet, name, block.timestamp, merchantCount)
        );

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
        require(msg.sender == m.wallet, "UNAUTHORIZED");

        m.active = active;

        if (newWallet != address(0) && newWallet != m.wallet) {
            require(
                walletToMerchant[newWallet] == bytes32(0),
                "WALLET_ALREADY_REGISTERED"
            );
            pendingWallet[merchantId] = newWallet;
            emit MerchantWalletUpdateInitiated(merchantId, newWallet);
        }

        emit MerchantUpdated(merchantId, m.wallet, active);
    }

    function confirmWalletUpdate(bytes32 merchantId) external {
        address proposed = pendingWallet[merchantId];
        require(proposed != address(0), "NO_PENDING_WALLET");
        require(msg.sender == proposed, "UNAUTHORIZED");

        Merchant storage m = merchants[merchantId];

        delete walletToMerchant[m.wallet];
        walletToMerchant[proposed] = merchantId;
        m.wallet = proposed;
        delete pendingWallet[merchantId];

        emit MerchantWalletUpdateConfirmed(merchantId, proposed);
    }

    function cancelWalletUpdate(bytes32 merchantId) external {
        Merchant storage m = merchants[merchantId];
        require(msg.sender == m.wallet, "UNAUTHORIZED");
        require(pendingWallet[merchantId] != address(0), "NO_PENDING_WALLET");

        delete pendingWallet[merchantId];
        emit MerchantWalletUpdateCancelled(merchantId);
    }

    function setMerchantFee(
        bytes32 merchantId,
        uint256 feeBps
    ) external onlyOwner merchantExists(merchantId) {
        require(feeBps <= MAX_FEE_BPS, "FEE_TOO_HIGH");
        merchants[merchantId].customFeeBps = feeBps;
        emit MerchantFeeUpdated(merchantId, feeBps);
    }

    // ========================================================================
    // Internal helpers (extracted to reduce stack depth)
    // ========================================================================

    function _getFee(
        bytes32 merchantId,
        uint256 amount
    ) internal view returns (uint256) {
        uint256 bps = merchants[merchantId].customFeeBps > 0
            ? merchants[merchantId].customFeeBps
            : protocolFeeBps;
        return (amount * bps) / BPS_DENOMINATOR;
    }

    function _generatePaymentId(
        address payer,
        bytes32 merchantId
    ) internal returns (bytes32) {
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
        string calldata preference,
        uint256 minAmountOut
    )
        external
        nonReentrant
        validMerchant(merchantId)
        validToken(token)
        returns (bytes32)
    {
        require(amount > 0, "INVALID_AMOUNT");

        uint256 fee = _getFee(merchantId, amount);
        uint256 merchantAmount = amount - fee;

        require(merchantAmount >= minAmountOut, "SLIPPAGE_EXCEEDED");

        IERC20(token).safeTransferFrom(
            msg.sender,
            merchants[merchantId].wallet,
            merchantAmount
        );

        if (fee > 0) {
            IERC20(token).safeTransferFrom(msg.sender, feeCollector, fee);
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
        Interval interval,
        bool autoCharge
    )
        external
        nonReentrant
        validMerchant(merchantId)
        validToken(token)
        returns (bytes32)
    {
        require(amount > 0, "INVALID_AMOUNT");

        bytes32 subscriptionId = keccak256(
            abi.encodePacked(
                msg.sender,
                merchantId,
                amount,
                block.timestamp,
                block.number,
                userSubscriptions[msg.sender].length
            )
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
            lastChargeAt: 0,
            nextChargeAt: autoCharge ? block.timestamp : _calculateNextCharge(block.timestamp, interval),
            chargeCount: 0
        });

        uint256 userSubLen = userSubscriptions[msg.sender].length;
        uint256 merchantSubLen = merchantSubscriptions[merchantId].length;

        userSubscriptions[msg.sender].push(subscriptionId);
        merchantSubscriptions[merchantId].push(subscriptionId);

        userSubscriptionIndex[subscriptionId][msg.sender] = userSubLen;
        merchantSubscriptionIndex[subscriptionId][merchantId] = merchantSubLen;

        emit SubscriptionCreated(
            subscriptionId,
            msg.sender,
            merchantId,
            amount,
            interval
        );

        if (autoCharge) {
            _chargeSubscription(subscriptionId, 0);
        }

        return subscriptionId;
    }

    function chargeSubscription(bytes32 subscriptionId, uint256 minAmountOut) external nonReentrant {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.id != bytes32(0), "SUBSCRIPTION_NOT_FOUND");
        require(
            sub.status == SubscriptionStatus.Active,
            "SUBSCRIPTION_NOT_ACTIVE"
        );
        require(block.timestamp >= sub.nextChargeAt, "SUBSCRIPTION_NOT_DUE");

        _chargeSubscription(subscriptionId, minAmountOut);
    }

    function batchChargeSubscriptions(
        bytes32[] calldata subscriptionIds,
        uint256 minAmountOut
    ) external nonReentrant {
        for (uint256 i = 0; i < subscriptionIds.length; i++) {
            bytes32 subId = subscriptionIds[i];
            Subscription storage sub = subscriptions[subId];
            if (sub.id == bytes32(0)) {
                emit BatchChargeFailed(subId, "NOT_FOUND");
                continue;
            }
            if (
                sub.status == SubscriptionStatus.Active &&
                block.timestamp >= sub.nextChargeAt
            ) {
                try this._chargeSubscriptionExternal(subId, minAmountOut) {}
                catch Error(string memory reason) {
                    emit BatchChargeFailed(subId, reason);
                } catch Panic(uint256) {
                    emit BatchChargeFailed(subId, "PANIC");
                } catch (bytes memory) {
                    emit BatchChargeFailed(subId, "UNKNOWN");
                }
            }
        }
    }

    function _chargeSubscriptionExternal(
        bytes32 subscriptionId,
        uint256 minAmountOut
    ) external {
        require(msg.sender == address(this), "INTERNAL_ONLY");
        _chargeSubscription(subscriptionId, minAmountOut);
    }

    function pauseSubscription(bytes32 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.id != bytes32(0), "SUBSCRIPTION_NOT_FOUND");
        require(msg.sender == sub.subscriber, "UNAUTHORIZED");
        require(sub.status == SubscriptionStatus.Active, "NOT_ACTIVE");

        sub.status = SubscriptionStatus.Paused;
        emit SubscriptionStatusChanged(
            subscriptionId,
            SubscriptionStatus.Paused
        );
    }

    function resumeSubscription(bytes32 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.id != bytes32(0), "SUBSCRIPTION_NOT_FOUND");
        require(msg.sender == sub.subscriber, "UNAUTHORIZED");
        require(sub.status == SubscriptionStatus.Paused, "NOT_PAUSED");

        sub.status = SubscriptionStatus.Active;
        sub.nextChargeAt = _calculateNextCharge(block.timestamp, sub.interval);
        emit SubscriptionStatusChanged(
            subscriptionId,
            SubscriptionStatus.Active
        );
    }

    function cancelSubscription(bytes32 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.id != bytes32(0), "SUBSCRIPTION_NOT_FOUND");
        require(sub.status != SubscriptionStatus.Cancelled, "ALREADY_CANCELLED");
        Merchant storage merchant = merchants[sub.merchantId];
        require(
            msg.sender == sub.subscriber ||
                msg.sender == merchant.wallet ||
                msg.sender == owner,
            "UNAUTHORIZED"
        );

        sub.status = SubscriptionStatus.Cancelled;
        emit SubscriptionStatusChanged(
            subscriptionId,
            SubscriptionStatus.Cancelled
        );

        _removeSubscriptionFromArrays(subscriptionId);
    }

    function _removeSubscriptionFromArrays(bytes32 subscriptionId) internal {
        Subscription storage sub = subscriptions[subscriptionId];
        address subscriber = sub.subscriber;
        bytes32 merchantId = sub.merchantId;

        if (subscriber != address(0)) {
            uint256 userIndex = userSubscriptionIndex[subscriptionId][subscriber];
            bytes32[] storage userSubs = userSubscriptions[subscriber];
            require(userSubs[userIndex] == subscriptionId, "INDEX_CORRUPT");
            if (userIndex < userSubs.length - 1) {
                bytes32 lastId = userSubs[userSubs.length - 1];
                userSubs[userIndex] = lastId;
                userSubscriptionIndex[lastId][subscriber] = userIndex;
            }
            userSubs.pop();
            delete userSubscriptionIndex[subscriptionId][subscriber];
        }

        if (merchantId != bytes32(0)) {
            uint256 merchantIndex = merchantSubscriptionIndex[subscriptionId][merchantId];
            bytes32[] storage merchantSubs = merchantSubscriptions[merchantId];
            require(merchantSubs[merchantIndex] == subscriptionId, "INDEX_CORRUPT");
            if (merchantIndex < merchantSubs.length - 1) {
                bytes32 lastId = merchantSubs[merchantSubs.length - 1];
                merchantSubs[merchantIndex] = lastId;
                merchantSubscriptionIndex[lastId][merchantId] = merchantIndex;
            }
            merchantSubs.pop();
            delete merchantSubscriptionIndex[subscriptionId][merchantId];
        }
    }

    function updateSubscriptionAmount(
        bytes32 subscriptionId,
        uint256 newAmount
    ) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.id != bytes32(0), "SUBSCRIPTION_NOT_FOUND");
        require(msg.sender == sub.subscriber, "UNAUTHORIZED");
        require(newAmount > 0, "INVALID_AMOUNT");

        sub.amount = newAmount;
    }

    // ========================================================================
    // Internal
    // ========================================================================

    function _chargeSubscription(bytes32 subscriptionId, uint256 minAmountOut) internal {
        Subscription storage sub = subscriptions[subscriptionId];
        uint256 fee = _getFee(sub.merchantId, sub.amount);
        uint256 merchantAmount = sub.amount - fee;

        require(merchantAmount >= minAmountOut, "SLIPPAGE_EXCEEDED");

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

        IERC20(sub.token).safeTransferFrom(
            sub.subscriber,
            merchants[sub.merchantId].wallet,
            merchantAmount
        );

        if (fee > 0) {
            IERC20(sub.token).safeTransferFrom(
                sub.subscriber,
                feeCollector,
                fee
            );
        }
    }

    function _calculateNextCharge(
        uint256 from,
        Interval interval
    ) internal pure returns (uint256) {
        if (interval == Interval.Weekly) return from + 7 days;
        if (interval == Interval.Monthly) return from + 30 days;
        if (interval == Interval.Quarterly) return from + 90 days;
        if (interval == Interval.Yearly) return from + 365 days;
        revert("INVALID_INTERVAL");
    }

    // ========================================================================
    // Admin
    // ========================================================================

    function setSupportedToken(
        address token,
        bool supported
    ) external onlyOwner {
        require(token != address(0), "INVALID_TOKEN");
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
        pendingOwner = newOwner;
    }

    function acceptOwnership() external {
        require(msg.sender == pendingOwner, "UNAUTHORIZED");
        owner = pendingOwner;
        delete pendingOwner;
    }

    // ========================================================================
    // View Functions
    // ========================================================================

    function getUserSubscriptions(
        address user
    ) external view returns (bytes32[] memory) {
        return userSubscriptions[user];
    }

    function getMerchantSubscriptions(
        bytes32 merchantId
    ) external view returns (bytes32[] memory) {
        return merchantSubscriptions[merchantId];
    }

    function getSubscriptionDetails(
        bytes32 subscriptionId
    ) external view returns (Subscription memory) {
        return subscriptions[subscriptionId];
    }

    function getPaymentDetails(
        bytes32 paymentId
    ) external view returns (Payment memory) {
        return payments[paymentId];
    }

    function getMerchantDetails(
        bytes32 merchantId
    ) external view returns (Merchant memory) {
        require(merchants[merchantId].registeredAt != 0, "MERCHANT_NOT_FOUND");
        return merchants[merchantId];
    }

    function isSubscriptionDue(
        bytes32 subscriptionId
    ) external view returns (bool) {
        Subscription memory sub = subscriptions[subscriptionId];
        require(sub.id != bytes32(0), "SUBSCRIPTION_NOT_FOUND");
        return
            sub.status == SubscriptionStatus.Active &&
            block.timestamp >= sub.nextChargeAt;
    }

    function getEffectiveFee(
        bytes32 merchantId
    ) external view merchantExists(merchantId) returns (uint256) {
        uint256 custom = merchants[merchantId].customFeeBps;
        return custom > 0 ? custom : protocolFeeBps;
    }
}
