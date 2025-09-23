import mongoose, { MongooseError } from "mongoose"

const complaintSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
            category: {
                type: String,
                enum: ["Sanitation", "Water Supply", "Roads", "Electricity", "Other"],
                required: true
            },
        status : {
            type : String,
            enum : ["Pending", "In Progress", "Resolved", "Closed"],
            default : "Pending",
        },
        citizen : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    },
    {timestamps : true}
);

export default mongoose.model("Complaint", complaintSchema);    