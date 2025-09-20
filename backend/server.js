import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../backend/routes/auth.js"
import complaintRoutes from "../backend/routes/complaints.js"

dotenv.config();

const app = express();

// *Middleware

app.use(express.json());    
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// *Test Routes

app.get("/", (req, res) => {
    res.send("Smart Grievance Portal API is running...");
});

// *MongoDB connection

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DataBase Connected"))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));