const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(express.json()); // req.body ke liye zaruri

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/recharge_app")
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log("MongoDB connection error:", err));

// POST route to save user
app.post("/add-user", async (req, res) => {
    try {
        const user = new User(req.body); // req.body directly use
        await user.save();               //  ye DB me save karega
        res.send({ message: "Data saved successfully", data: user });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving data");
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
