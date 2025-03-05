const express = require('express');
const route = express.Router();
const { validation } = require('../middleware/auth');

// route.post('/search', validation, );
// route.post('/transactions/search', validation, );
// route.get('/:savingsPlanId', validation, );

module.exports = route;