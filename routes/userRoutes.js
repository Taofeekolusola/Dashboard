const express = require('express');
const route = express.Router();
const multer = require('multer')
const { validation } = require('../middleware/auth');
const {
    loginHandler,
    requestPasswordReset,
    resetPassword,
    verifyResetCode,
    registerHandler,
    verifyLoginHandler
  
} = require('../controllers/userController');

// ✅ Define Multer Storage for Profile Picture
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });

route.post('/login', loginHandler);
route.post('/verify', verifyResetCode)
route.post('/reset', resetPassword)
route.post('/request', requestPasswordReset)
route.post("/register", upload.single("profilePicture"), registerHandler);
route.post('/verify-login', verifyLoginHandler);
route.post('/', validation, (req, res) => {
    res.json(req.user)
})
module.exports = route;