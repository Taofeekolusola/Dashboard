const Investment = require('../models/Investment');


// Make Investment
const makeInvestment = async (req, res) => {
    try {
        const { userId, investmentType, investmentName, userName, amountInvested, expectedReturn, startDate, maturityDate } = req.body;

        const newInvestment = new Investment({
            userId,
            investmentType,
            investmentName,
            userName,
            amountInvested,
            expectedReturn,
            startDate,
            maturityDate
        });

        await newInvestment.save();

        res.status(201).json({ investment: newInvestment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get all investments for a specific user
const getUserInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ userId: req.params.userId });

        res.json(investments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get a specific investment by its ID
const getInvestmentById = async (req, res) => {
    try {
        const investment = await Investment.findById(req.params.investmentId);

        if (!investment) return res.status(404).json({ message: 'Investment not found' });

        res.json(investment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Update an investment by its ID
const updateInvestment = async (req, res) => {
    try {
        const investment = await Investment.findByIdAndUpdate(req.params.investmentId, req.body, { new: true });

        if (!investment) return res.status(404).json({ message: 'Investment not found' });

        res.json(investment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Delete an investment by its ID
const deleteInvestment = async (req, res) => {
    try {
        const investment = await Investment.findByIdAndDelete(req.params.investmentId);

        if (!investment) return res.status(404).json({ message: 'Investment not found' });

        res.json({ message: 'Investment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get all investments for all users
const getAllInvestments = async (req, res) => {
    try {
        const investments = await Investment.find();

        res.json(investments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    makeInvestment,
    getUserInvestments,
    getInvestmentById,
    updateInvestment,
    deleteInvestment,
    getAllInvestments
}