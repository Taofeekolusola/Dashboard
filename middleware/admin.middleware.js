const Admin = require('../models/admin.model');

const isAdmin = async (req, res, next) => {
  try {
    const adminId = req.user._id
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(401).json({ message: 'Unauthorized' });
    next()
  }
  catch (error){
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = isAdmin;