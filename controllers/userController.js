const bcrypt = require("bcryptjs");
const UserProfile = require("../models/UsersProfile");
const jwt = require("jsonwebtoken");

//create user 
const createUserHandler = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            bvn,
            kyc_status
        } = req.body;
        const user = new UserProfile({
            name,
            email,
            phone,
            bvn,
            kyc_status
        });
        await user.save();
        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Create user error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//get users
const getUsersHandler = async (req, res) => {
    try {
        const users = await UserProfile.find();
        return res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//get user by id
const getUserByIdHandler = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserProfile.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        console.error("Get user by id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//update user by id
const updateUserByIdHandler = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await UserProfile.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(updatedUser);
    } catch (error) {
        console.error("Update user by id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//delete user by id
const deleteUserByIdHandler = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await UserProfile.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user by id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//login user
const loginUserHandler = async (req, res) => { 
    try {
        const { email, password } = req.body;
        const user = await UserProfile.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return res.json({ message: "Logged in successfully", token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createUserHandler,
    getUsersHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,
    loginUserHandler,
}