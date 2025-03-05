const Investment = require("../models/investments.model");
const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model")
const paginate = require("../utils/paginate");

const searchInvestments = async (req, res) => {
  try {
    const { search, status, startDate, endDate, page = 1, limit = 10 } = req.body;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const query = {};

    if (search) {
      const users = await User.find({ fullName: { $regex: search, $options: "i" } }).select("_id");
      const userIds = users.map(user => user._id);

      const wallets = await Wallet.find({ userId: { $in: userIds } }).select("_id");
      const walletIds = wallets.map(wallet => wallet._id);

      query.walletId = { $in: walletIds };
    }

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const investments = await Investment.find(query)
      .populate({
        path: "walletId",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const total = await Investment.countDocuments(query);

    const investmentIds = investments.map(investment => investment._id);
    const transactionsMap = {};

    const transactions = await Transaction.find({ relatedEntity: "Investment", relatedEntityId: { $in: investmentIds } })
      .sort({ createdAt: -1 })
      .limit(3 * investments.length);

    transactions.forEach(transaction => {
      if (!transactionsMap[transaction.relatedEntityId]) {
        transactionsMap[transaction.relatedEntityId] = [];
      }
      if (transactionsMap[transaction.relatedEntityId].length < 3) {
        transactionsMap[transaction.relatedEntityId].push(transaction);
      }
    });

    const investmentsWithTransactions = investments.map(investment => ({
      ...investment.toObject(),
      recentTransactions: transactionsMap[investment._id] || [],
    }));

    res.status(200).json({
      success: true,
      message: "Investments retrieved successfully!",
      data: investmentsWithTransactions,
      pagination: paginate(total, page, limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const fetchInvestmentTransactions = async (req, res) => {
  try {
    const { search, startDate, endDate, status, page = 1, limit = 10 } = req.body;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const query = { relatedEntity: "Investment" };

    if (search) {
      const users = await User.find({ fullName: { $regex: search, $options: "i" } }).select("_id");
      const userIds = users.map(user => user._id);

      const wallets = await Wallet.find({ userId: { $in: userIds } }).select("_id");
      const walletIds = wallets.map(wallet => wallet._id);

      query.walletId = { $in: walletIds };
    }

    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query)
      .populate({
        path: "walletId",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Investment transactions retrieved successfully!",
      data: transactions,
      pagination: paginate(total, page, limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  searchInvestments,
  fetchInvestmentTransactions,
};
