const { sendMail } = require('./EmailConfig');

exports.sendPaymentConfirmation = async (email, paymentData) => {
  const { id, amount, currency = 'USD' } = paymentData;
  return sendMail(
    email,
    `Payment Confirmed - ${id}`,
    `
      <h2>Payment Successful</h2>
      <p>Your payment has been confirmed.</p>
      <ul>
        <li><strong>Transaction ID:</strong> ${id}</li>
        <li><strong>Amount:</strong> $${amount} ${currency}</li>
      </ul>
      <p>Thank you for your payment!</p>
    `
  );
};

exports.sendBillConfirmation = async (email, billData) => {
  const { type, provider, amount, phone, reference } = billData;
  return sendMail(
    email,
    `Bill Purchase Confirmed - ${provider}`,
    `
      <h2>Bill Purchase Successful</h2>
      <p>Your ${type} purchase has been processed.</p>
      <ul>
        <li><strong>Service:</strong> ${provider}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Amount:</strong> $${amount}</li>
        <li><strong>Reference:</strong> ${reference}</li>
      </ul>
      <p>Thank you for using Strimz!</p>
    `
  );
};

exports.sendBillFailedNotification = async (email, billData, error) => {
  const { type, provider, phone } = billData;
  return sendMail(
    email,
    `Bill Purchase Failed - ${provider}`,
    `
      <h2>Bill Purchase Failed</h2>
      <p>Unfortunately, your ${type} purchase could not be completed.</p>
      <ul>
        <li><strong>Service:</strong> ${provider}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Error:</strong> ${error}</li>
      </ul>
      <p>Please contact support if this persists.</p>
    `
  );
};

exports.sendPaymentFailedNotification = async (email, paymentData) => {
  const { id } = paymentData;
  return sendMail(
    email,
    `Payment Failed - ${id}`,
    `
      <h2>Payment Failed</h2>
      <p>Your payment could not be processed.</p>
      <ul>
        <li><strong>Transaction ID:</strong> ${id}</li>
      </ul>
      <p>Please try again or contact support.</p>
    `
  );
};

exports.sendSubscriptionWelcome = async (email, subData) => {
  const { id, interval, amount } = subData;
  return sendMail(
    email,
    'Welcome to Strimz Premium!',
    `
      <h2>Subscription Activated</h2>
      <p>Your premium subscription is now active!</p>
      <ul>
        <li><strong>Subscription ID:</strong> ${id}</li>
        <li><strong>Billing:</strong> ${interval}</li>
        <li><strong>Amount:</strong> $${amount}</li>
      </ul>
      <p>Thank you for subscribing!</p>
    `
  );
};

exports.sendSubscriptionCancelled = async (email, subData) => {
  const { id } = subData;
  return sendMail(
    email,
    'Subscription Cancelled',
    `
      <h2>Subscription Cancelled</h2>
      <p>Your Strimz subscription has been cancelled.</p>
      <ul>
        <li><strong>Subscription ID:</strong> ${id}</li>
      </ul>
      <p>You can resubscribe anytime.</p>
    `
  );
};

exports.sendSubscriptionRenewed = async (email, subData) => {
  const { id, nextBillingDate } = subData;
  return sendMail(
    email,
    'Subscription Renewed',
    `
      <h2>Subscription Renewed</h2>
      <p>Your Strimz subscription has been renewed!</p>
      <ul>
        <li><strong>Subscription ID:</strong> ${id}</li>
        <li><strong>Next Billing:</strong> ${nextBillingDate}</li>
      </ul>
    `
  );
};
