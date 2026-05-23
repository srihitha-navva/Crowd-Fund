//CampaignModel.js

import { Schema, model, Types } from "mongoose";

const CampaignSchema = new Schema({
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "User required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 5000,
        required: [true, "Description required"]
    },
    story: {
        type: String,
        maxlength: 10000
    },
    category: {
        type: String,
        enum: ["Medical", "Education", "Emergency", "Environment", "Community", "Other"],
        default: "Other"
    },
    image: {
        type: String
    },
    proofFiles: [{
        url: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        type: {
            type: String
        },
        resourceType: {
            type: String
        }
    }],
    goalAmount: {
        type: Number,
        required: [true, "Goal amount required"],
        min: [1, "Goal amount must be greater than 0"]
    },
    raisedAmount: {
        type: Number,
        default: 0
    },
    donorCount:{
        type:Number,
        default:0
    },
    deadline: {
        type: Date,
        required: [true, "Deadline required"]
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    }
},{ 
    timestamps: true,
    versionKey:false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

CampaignSchema.virtual("donorsCount").get(function () {
    return this.donorCount;
})

CampaignSchema.index({ status: 1, createdAt: -1 })
CampaignSchema.index({ createdBy: 1, createdAt: -1 })

export const CampaignModel = model("campaign", CampaignSchema)
