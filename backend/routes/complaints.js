import express from "express"
import complaint from "../models/Complaint.js"
import {authMiddleware, authorizeRoles} from "../middleware/auth.js"
import Complaint from "../models/Complaint.js";

const router = express.Router();

// *Create complaint (Citizens Only)

router.post("/", authMiddleware, authorizeRoles("Citizens"), async(req,res) =>{
    try{
        const {title, description, category} = req.body;

        const complaint = await Complaint.create({
            title,
            description,
            category,
            citizen: req.user.id,
        });
        res.status(201).json({message : "Complaint Created", complaint});
    }catch(err){
        res.status(500).json({error : error.message})
    }
});

// *Get complaints (citizens sees their own and admins sees all)

router.get("/", authMiddleware, async (req,res) =>{
    try{
        let complaints;
        if(req.user.role === "admin"){
            complaints = await Complaint.find().populate("Citizen", "name email");
        } else {
            complaints = await Complaint.find()({citizen : req.user.id});
        }

        res.json(complaints);
    }catch(error){
        res.status(500).json({error : error.message});
    }
});

//* Update Complaints status or assign officer (admin only)

router.patch("/", authMiddleware, authorizeRoles("admin"), async (req,res) =>{
    try{
        const {status, assignedTo} = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {status, assignedTo},
            {new : true}
        );

        if(!updatedComplaint){
            return res.status(404).json({error : "Complaint Not Found"});
        }
        res.json({message : "Complaint Updated", updatedComplaint});
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});

export default router;