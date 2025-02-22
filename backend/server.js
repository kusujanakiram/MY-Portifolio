require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(bodyParser.json()); // Parse JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Define Review Schema
const reviewSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now }
});

// Create Model
const Review = mongoose.model("Review", reviewSchema);

// API Route to Submit a Review
app.post("/submit-review", async (req, res) => {
    try {
        const { name, email, message, rating } = req.body;
        if (!name || !email || !message || !rating) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newReview = new Review({ name, email, message, rating });
        await newReview.save();
        
        res.status(201).json({ message: "Review submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error, try again later." });
    }
});

// API Route to Fetch All Reviews
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Error fetching reviews." });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
