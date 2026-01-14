const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
require("dotenv").config();

const User = require("./models/User");

const app = express();
app.use(express.json());
// CORS enable (simple)
app.use(cors());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/recharge_app")
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log("MongoDB connection error:", err));

// -------------------- REGISTER --------------------
app.post("/register", async (req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        const userExist = await User.findOne({ email });
        if(userExist){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            mobile,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: "User registered successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// -------------------- TEST PROTECTED ROUTE --------------------
app.get("/profile", async (req, res) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        res.json({ user });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// -------------------- SERVER --------------------
app.listen(3000, () => console.log("Server running on port 3000"));
