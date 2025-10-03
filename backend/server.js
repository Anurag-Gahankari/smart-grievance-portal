import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../backend/routes/auth.js"
import complaintRoutes from "../backend/routes/complaints.js"
import { sendResponse } from "../backend/utils/response.js"

dotenv.config();

const app = express();

// *Middleware

app.use(express.json());    
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// *Test Routes

app.get("/", (req, res) => {
    sendResponse(res, true, "Smart Grievance Portal API is running...");
});

// Global error handler (optional, for catching unhandled errors)
app.use((err, req, res, next) => {
    sendResponse(res, false, "Internal Server Error", null, err.message, 500);
});

// *MongoDB connection

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DataBase Connected"))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));