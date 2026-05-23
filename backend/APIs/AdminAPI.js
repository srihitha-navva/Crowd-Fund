// AdminAPI.js

import exp from 'express';
import { sendEmail } from '../utils/sendEmail.js';
import { UserModel } from '../models/UserModel.js';
import { CampaignModel } from '../models/CampaignModel.js';
import { DonationModel } from '../models/DonationModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const adminApp=exp.Router()

// get all pending campaigns
adminApp.get('/campaigns/pending',verifyToken("ADMIN"),async (req, res) => {
    try{
        const campaigns=await CampaignModel.find({status: "PENDING"})
            .populate("createdBy","name email")
            .sort({createdAt:-1})
        res.status(200).json({message:"Pending campaigns",payload:campaigns})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

// get all campaigns
adminApp.get('/campaigns',verifyToken("ADMIN"),async (req, res) => {
    try{
        const campaigns=await CampaignModel.find({})
            .populate("createdBy","name email")
            .sort({createdAt:-1})
        res.status(200).json({message:"All campaigns",payload:campaigns})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

// admin dashboard stats
adminApp.get('/stats',verifyToken("ADMIN"),async (req, res) => {
    try{
        const [users, campaigns, pendingCampaigns, donations, donationTotals]=await Promise.all([
            UserModel.countDocuments({role: {$ne: "ADMIN"}}),
            CampaignModel.countDocuments(),
            CampaignModel.countDocuments({status:"PENDING"}),
            DonationModel.countDocuments(),
            DonationModel.aggregate([
                {$group:{_id:null,total:{$sum:"$amount"}}}
            ])
        ])

        res.status(200).json({
            message:"Admin stats",
            payload:{
                users,
                campaigns,
                pendingCampaigns,
                donations,
                totalRaised: donationTotals[0]?.total || 0
            }
        })
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

// get all users
adminApp.get('/users',verifyToken("ADMIN"),async (req, res) => {
    try{
        const users=await UserModel.find({}).select("-password").sort({createdAt:-1})
        res.status(200).json({message:"All users",payload:users})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

// approve campaign
adminApp.put('/campaigns/approve/:id',verifyToken("ADMIN"),async (req, res) => {
    try{
        const campaignId=req.params.id
        const updated=await CampaignModel.findByIdAndUpdate(
            campaignId,
            {$set:{status:"APPROVED"}},
            {returnDocument:'after'}
        )
        if(!updated)
            return res.status(404).json({message:"Campaign not found"})
        //send email to fundraiser on campaign approval
        // get fundraiser details
        const user = await UserModel.findById(updated.createdBy)
        // send email
        if(user?.email) {
            await sendEmail({
                to: user.email,
                subject: "Campaign Approved",
                html: `<h2>Your campaign has been approved!</h2>
                <p><b>${updated.title}</b> is now live.</p>`
            })
        }
        res.status(200).json({message: "Campaign approved",payload: updated})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

// reject campaign
adminApp.put('/campaigns/reject/:id',verifyToken("ADMIN"),async (req, res) => {
    try {
        const campaignId=req.params.id
        const updated=await CampaignModel.findByIdAndUpdate(
            campaignId,
            {$set:{status:"REJECTED"}},
            {returnDocument:'after'}
        )
        if(!updated)
            return res.status(404).json({message:"Campaign not found"})
        res.status(200).json({message:"Campaign rejected",payload:updated}) 
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
