import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { sendResponse } from "../utils/response.js"

const router = express.Router();

// *Register

router.post("/register", async (req, res) => {
    try{
        const {name, email, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, password : hashedPassword, role});
        sendResponse(res, true, "User registered", { userId: user._id }, null, 201);
    }catch(error){
        sendResponse(res, false, "Registration failed", null, error.message, 500);
    }
});

// *Login

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return sendResponse(res, false, "Invalid Credentials", null, "Invalid Credentials", 401);

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return sendResponse(res, false, "Invalid Password", null, "Invalid Password", 401);

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, { 
            expiresIn: "1h",
        });

        sendResponse(res, true, "Login successful", { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }catch(error){
        sendResponse(res, false, "Login failed", null, error.message, 500);
    }
});

// *Get all officers

router.get("/officers", async (req, res) => {
    try{
        const officers = await User.find({role: "officer"}).select("_id name email");
        sendResponse(res, true, "Officers fetched", { officers });
    }catch(error){
        sendResponse(res, false, "Failed to fetch officers", null, error.message, 500);
    }
});

export default router;