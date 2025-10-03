import express from "express"
import complaint from "../models/complaint.js"
import {authMiddleware, authorizeRoles} from "../middleware/auth.js"
import Complaint from "../models/complaint.js";
import { sendResponse } from "../utils/response.js"

const router = express.Router();

// *Create complaint (Citizens Only)

router.post("/", authMiddleware, authorizeRoles("citizen"), async(req,res) =>{
    try{
        const {title, description, category} = req.body;

        const complaint = await Complaint.create({
            title,
            description,
            category,
            citizen: req.user.id,
        });
        sendResponse(res, true, "Complaint Created", { complaint }, null, 201);
    }catch(err){
        sendResponse(res, false, "Complaint creation failed", null, err.message, 500);
    }
});

// *Get complaints (citizens sees their own and admins sees all)

router.get("/", authMiddleware, async (req,res) =>{
    try{
        let complaints;
        if(req.user.role === "admin"){
            complaints = await Complaint.find().populate("citizen", "name email");
        } else {
            complaints = await Complaint.find({citizen : req.user.id});
        }

        sendResponse(res, true, "Complaints fetched", { complaints });
    }catch(error){
        sendResponse(res, false, "Failed to fetch complaints", null, error.message, 500);
    }
});

//* Update Complaints status or assign officer (admin only)

router.patch("/:id", authMiddleware, authorizeRoles("admin"), async (req,res) =>{
    try{
        const {status, assignedTo} = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {status, assignedTo},
            {new : true, runValidators: true}
        );

        if(!updatedComplaint){
            return sendResponse(res, false, "Complaint Not Found", null, "Complaint Not Found", 404);
        }
        sendResponse(res, true, "Complaint Updated", { updatedComplaint });
    }catch(error){
        sendResponse(res, false, "Failed to update complaint", null, error.message, 500);
    }
});

export default router;