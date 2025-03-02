const Savings = require('../models/Savings')
//const mongoose = require('mongoose');

// Create a new savings plan
const createSavingsPlan = async (req, res) => {
    try {
        const { userId, planName, userName, targetAmount, startDate, maturityDate } = req.body;

        const newSavings = new Savings({
            userId,
            planName,
            userName,
            targetAmount,
            startDate,
            maturityDate,
        });

        await newSavings.save();

        res.status(201).json({ message: 'Savings plan created successfully', newSavings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all savings plans for a specific user
const getAllSavingsPlansForUser = async (req, res) => {
    try {
        const savingsPlans = await Savings.find({ userId: req.params.userId });

        res.json(savingsPlans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific savings plan by its ID
const getSavingsPlanById = async (req, res) => {
    try {
        const savingsPlan = await Savings.findById(req.params.savingsId);

        if (!savingsPlan) return res.status(404).json({ message: 'Savings plan not found' });

        res.json(savingsPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a savings plan by its ID
const updateSavingsPlan = async (req, res) => {
    try {
        const savingsPlan = await Savings.findByIdAndUpdate(req.params.savingsId, req.body, { new: true });

        if (!savingsPlan) return res.status(404).json({ message: 'Savings plan not found' });

        res.json(savingsPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a savings plan by its ID
const deleteSavingsPlan = async (req, res) => {
    try {
        const savingsPlan = await Savings.findByIdAndDelete(req.params.savingsId);

        if (!savingsPlan) return res.status(404).json({ message: 'Savings plan not found' });

        res.json({ message: 'Savings plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get all savingplans for all users
const getAllSavingsPlansForAllUsers = async (req, res) => {
    try {
        const savingsPlans = await Savings.find();

        res.json(savingsPlans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSavingsPlan,
    getAllSavingsPlansForUser,
    getSavingsPlanById,
    updateSavingsPlan,
    deleteSavingsPlan,
    getAllSavingsPlansForAllUsers,
}