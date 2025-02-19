const express = require('express');
const route = express.Router();
const { validation } = require('../middleware/auth');
const {
    loginHandler,
    requestPasswordReset,
    resetPassword,
    verifyResetCode,
} = require('../controllers/userController');

route.post('/login', loginHandler);
route.post('/verify', verifyResetCode)
route.post('/reset', resetPassword)
route.post('/request', requestPasswordReset)
route.post('/reset', validation, (req, res) => {
    res.json(req.user)
})
module.exports = route;