const { CheckDBResponse } = require("../../helpers");
const { User, Transaction, Subscription, PaymentSession, Payroll } = require("../../database/classes");
const { errorResponse } = require("../../helpers/messages/CheckDBStatus");

//add a new Partner
exports.createUser = async (data) => {
  try {
    const newUser = await User.createUser(data);
    return CheckDBResponse.response(newUser);
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};

//get all paginated users
exports.getAllUsers = async (page, size, query) => {
  try {
    //get all the user from the database
    const users = await User.getAllUsers(page, size, query);
    return CheckDBResponse.response(users);
  } catch (error) {
    return errorResponse(error);
  }
};

//get a user based on id
exports.getUser = async (id) => {
  try {
    const user = await User.getUserById(id);

    // const {password,createdAt,updatedAt, ...others} = user.dataValues;
    return CheckDBResponse.response(user);
  } catch (error) {
    return CheckDBResponse.errorResponse(error);
  }
};

exports.searchUser = async (query, page, size) => {
  try {
    const user = await User.searchUser(query, page, size);

    // const {password,createdAt,updatedAt, ...others} = user.dataValues;
    return CheckDBResponse.response(user);
  } catch (error) {
    return CheckDBResponse.errorResponse(error);
  }
};

//edit a user
exports.updateUser = async (id, data) => {
  try {
    const updatedUser = await User.updateUser(id, data);
    return CheckDBResponse.response(updatedUser);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

//delete Partner
exports.deleteUser = async (id) => {
  try {
    const result = await User.deleteUser(id);
    return CheckDBResponse.successResponse(result.message);
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};

exports.getUserDashboard = async (userId) => {
  try {
    const user = await User.getUserById(userId);
    if (!user || user.success === false) {
      return { success: false, error: "User not found" };
    }

    const userAddress = user.address;

    const transactions = await Transaction.findAll({
      where: { payer: userAddress },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    const subscriptions = await Subscription.findAll({
      where: { subscriber: userAddress },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    const paymentSessions = await PaymentSession.findAll({
      where: { customerEmail: user.email },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    const payrolls = await Payroll.findAll({
      where: { owner: userAddress },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    return {
      success: true,
      data: {
        profile: user,
        transactions: transactions.map(t => t.toJSON()),
        subscriptions: subscriptions.map(s => s.toJSON()),
        paymentSessions: paymentSessions.map(p => p.toJSON()),
        payrolls: payrolls.map(p => p.toJSON()),
      },
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};
