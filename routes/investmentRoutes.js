const express = require('express');
const route = express.Router();
const { makeInvestment,
    getUserInvestments,
    getInvestmentById,
    updateInvestment,
    deleteInvestment,
    getAllInvestments
} = require('../controllers/investmentController');
const { validation } = require('../middleware/auth');

route.post('/create', validation, makeInvestment);
route.get('/user/:userId', validation, getUserInvestments);
route.get('/get/:investmentId', validation, getInvestmentById);
route.put('/update/:investmentId', validation, updateInvestment);
route.delete('/delete/:investmentId', validation, deleteInvestment);
route.get('/all', validation, getAllInvestments);

module.exports = route;