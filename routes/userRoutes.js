const express = require('express');
const route = express.Router();
const { validation } = require('../middleware/auth');
const {
    loginHandler,
    requestPasswordReset,
    resetPassword,
    verifyResetCode,
    registerHandler,
  
} = require('../controllers/userController');

route.post('/login', loginHandler);
route.post('/verify', verifyResetCode)
route.post('/reset', resetPassword)
route.post('/request', requestPasswordReset)
route.post('/register', registerHandler);
route.post('/', validation, (req, res) => {
    res.json(req.user)
})
module.exports = route;