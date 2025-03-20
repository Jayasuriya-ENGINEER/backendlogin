const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON data from the request body

// MongoDB connection
const url = "mongodb://127.0.0.1:27017/signup";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Defining the user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    aadhaar_number: { type: String, required: true, unique: true },
    mcp_card_number: { type: String, required: true },
    mobile_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirm_password: { type: String, required: true },
  },
  { timestamps: true }
);

// Creating the user model
const User = mongoose.model("User", userSchema);

// Sign-Up route
app.post("/signup", async (req, res) => {
  const {
    name,
    aadhaar_number,
    mcp_card_number,
    mobile_number,
    email,
    password,
    confirm_password,
  } = req.body;

  // Validation: Ensure passwords match
  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Save user to the database
    const newUser = new User({
      name,
      aadhaar_number,
      mcp_card_number,
      mobile_number,
      email,
      password,
      confirm_password,
    });
    await newUser.save();
    res.status(201).json({ message: "User signed up successfully" });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ message: "Error signing up. Please try again." });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user with matching email and password
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error logging in. Please try again." });
  }
});

// Start the server
app.listen(8081, () => {
  console.log("Backend server is running on http://localhost:8081");
});
