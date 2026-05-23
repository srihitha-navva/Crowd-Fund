//DonationModel.js

import { Schema, model, Types } from "mongoose";

const DonationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    campaignId: {
        type: Types.ObjectId,
        ref: "campaign",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, "Donation amount must be greater than 0"]
    },
    paymentId: {
        type: String
    }
},{ 
    timestamps: true,
    versionKey:false
})

export const DonationModel = model("donation", DonationSchema)
