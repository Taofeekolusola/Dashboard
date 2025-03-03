const express = require('express');
const routes = express.Router();
const {createTransaction,
    getUserTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transactionController')


routes.post('/create', createTransaction);
routes.get('/user/:userId', getUserTransactions);
routes.get('/get/:transactionId', getTransactionById);
routes.put('/update/:transactionId', updateTransaction);
routes.delete('/delete/:transactionId', deleteTransaction);

module.exports = routes;