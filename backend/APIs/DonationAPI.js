// DonationAPI.js

import exp from 'express';
import { sendEmail } from '../utils/sendEmail.js';
import { UserModel } from '../models/UserModel.js';
import { DonationModel } from '../models/DonationModel.js';
import { CampaignModel } from '../models/CampaignModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const donationApp = exp.Router()

const createDonation = async (req, res) => {
    try{
        const campaignId=req.params.campaignId || req.body.campaignId
        const amount=Number(req.body.amount)

        if(!campaignId)
            return res.status(400).json({message:"Campaign id is required"})
        if(!Number.isFinite(amount) || amount<=0)
            return res.status(400).json({message:"Donation amount must be greater than 0"})

        const campaign=await CampaignModel.findById(campaignId)
        //check if campaign exists
        if(!campaign)
            return res.status(404).json({message:"Campaign not found"})
        //check if approved
        if(campaign.status!=="APPROVED")
            return res.status(400).json({message:"Campaign not approved"})
        //check deadline
        if(new Date()>new Date(campaign.deadline))
            return res.status(400).json({message:"Campaign expired"})
        //check if donation exceeds goal amount
        if(campaign.raisedAmount+amount>campaign.goalAmount) 
            return res.status(400).json({message:"Exceeds goal amount"})
        //create donation
        const donation=await DonationModel.create({
            userId:req.user.id,
            campaignId,
            amount
        })
        //update campaign's raised amount and donor count after donations are raised
        await CampaignModel.findByIdAndUpdate(
            campaignId,{$inc:{
                    raisedAmount:amount,
                    donorCount:1
                }
            })
        //send email after donation
        // get donor details
        const donor = await UserModel.findById(req.user.id)
        // send email
        await sendEmail({
            to: donor.email,
            subject: "Donation Successful 🎉",
            html: `<h2>Thank you for your donation!</h2>
            <p>You donated ₹${amount} to <b>${campaign.title}</b></p>`
        })
        // send response
        res.status(201).json({message:"Donation successful",payload:donation})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

// donate to a campaign
donationApp.post("/donate/:campaignId",verifyToken("DONOR","FUNDRAISER","ADMIN"),createDonation)

// frontend-compatible donation route
donationApp.post("/donation",verifyToken("DONOR","FUNDRAISER","ADMIN"),createDonation)

// get logged in users donations (donation history)
donationApp.get("/my-donations",verifyToken("DONOR","FUNDRAISER","ADMIN"),async (req, res) => {
    try{
        //find user by userId
        const donations=await DonationModel.find({userId:req.user.id})
            .populate("campaignId")
            .sort({createdAt:-1})
        //send res
        res.status(200).json({message: "Your donations",payload: donations})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

// get donations for a campaign
donationApp.get("/campaign/:campaignId",verifyToken("FUNDRAISER","ADMIN"),async (req, res) => {
    try{
        const campaign=await CampaignModel.findById(req.params.campaignId)
        if(!campaign)
            return res.status(404).json({message:"Campaign not found"})
        if(req.user.role!=="ADMIN" && campaign.createdBy.toString()!==req.user.id)
            return res.status(403).json({message:"Not allowed"})

        const donations=await DonationModel.find({campaignId:req.params.campaignId})
            .populate("userId","name email")
            .sort({createdAt:-1})

        res.status(200).json({message:"Campaign donations",payload:donations})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
