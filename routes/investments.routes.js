const express = require('express');
const route = express.Router();
const { validation } = require('../middleware/auth');
const isAdmin = require('../middleware/admin.middleware');
const searchInvestments = require('../controllers/investments.controllers');

route.post('/search', validation, isAdmin, searchInvestments);
route.post('/transactions/search', validation, );
route.get('/:investmentId', validation, );

module.exports = route;