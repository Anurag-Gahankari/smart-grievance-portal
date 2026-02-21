import express from "express"
import {authMiddleware, authorizeRoles} from "../middleware/auth.js"
import Complaint from "../models/Complaint.js";
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

// *GET complaints with filtering + pagination

router.get("/", authMiddleware, async (req,res) =>{
    try{
        const{
            status,
            category,
            assignedTo,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        //* Citizens can only see their own complaints

        if(req.user.role === "citizen"){
            query.citizen = req.user.id;
        }

        // filters (case-insensitive / normalized)

        if(status){
            const allowedStatuses = ["Pending", "In Progress", "Resolved", "Closed"];
            const matchedStatus = allowedStatuses.find(s => s.toLowerCase() === String(status).toLowerCase().trim());
            if(matchedStatus){
                query.status = matchedStatus;
            } else {
                query.status = new RegExp(`^${String(status).trim()}$`, 'i');
            }
        }

        if(category){
            const allowedCategories = ["Sanitation", "Water Supply", "Roads", "Electricity", "Other"];
            const matchedCategory = allowedCategories.find(c => c.toLowerCase() === String(category).toLowerCase().trim());
            if(matchedCategory){
                query.category = matchedCategory;
            } else {
                query.category = new RegExp(`^${String(category).trim()}$`, 'i');
            }
        }

        // *Only Admin and Officer can filter by AssignedTo

        if(assignedTo && (req.user.role === "admin" || req.user.role === "officer")){
            query.assignedTo = assignedTo;
        }

        // *Officers can see complaints assigned to them

        if(req.user.role === "officer"){
            query.assignedTo = req.user.id;
        }

        // *Pagination Logic

        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const skip = (pageNumber - 1)*pageSize;
        
        const total = await Complaint.countDocuments(query);

        const complaints = await Complaint.find(query)
        .populate("citizen assignedTo", "name email role")
        .sort({ createdAt : -1})
        .skip(skip)
        .limit(pageSize)
        .exec();

        return sendResponse(res, true, "Complaints fetched successfully", {
            complaints,
            pagination : {
                totalRecords : total,
                currentPage : pageNumber,
                totalPages : Math.ceil(total / pageSize),
                pageSize,
            },
        });
    } catch(error){
        return sendResponse(res, false, "Failed to fetch complaints", null, error.message, 500);
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

//* Delete Complaint (admin only)

router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req,res) =>{
    try{
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);

        if(!deletedComplaint){
            return sendResponse(res, false, "Complaint Not Found", null, "Complaint Not Found", 404);
        }
        sendResponse(res, true, "Complaint Deleted", { deletedComplaint });
    }catch(error){
        sendResponse(res, false, "Failed to delete complaint", null, error.message, 500);
    }
});

export default router;