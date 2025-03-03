const Transaction = require('../models/Transactions');


// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const { transactionId, name, transactionType, amount, status, transactionDate } = req.body;

        const newTransaction = new Transaction({
            transactionId,
            name,
            transactionType,
            amount,
            status,
            transactionDate,
        });

        await newTransaction.save();

        res.status(201).json({ message: 'Transaction created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all transactions for a specific user
const getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ transactionId: req.params.userId });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific transaction by its ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);

        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a transaction by its ID
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.transactionId, req.body, { new: true });

        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a transaction by its ID
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.transactionId);

        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTransaction,
    getUserTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
}