// CampaignAPI.js

import exp from 'express';
import { isValidObjectId } from 'mongoose';
import { CampaignModel } from '../models/CampaignModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { campaignUpload } from '../config/multer.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';

export const campaignApp = exp.Router();

// create campaign -- only logged in users
campaignApp.post(
    "/campaign",
    verifyToken("FUNDRAISER","ADMIN"),
    campaignUpload.fields([
        { name: "campaignImage", maxCount: 1 },
        { name: "proofFiles", maxCount: 5 }
    ]),
    async (req, res) => {
    const uploadedFiles = []
    try{
        const campaignImage=req.files?.campaignImage?.[0]
        const proofFiles=req.files?.proofFiles || []
        let campaignImageUrl=req.body.image

        if(campaignImage){
            if(!campaignImage.mimetype.startsWith("image/"))
                return res.status(400).json({message:"Campaign image must be an image file"})
            const imageResult=await uploadToCloudinary(campaignImage.buffer, {
                folder: "crowdfund_campaigns",
                resourceType: "image"
            })
            uploadedFiles.push(imageResult)
            campaignImageUrl=imageResult.secure_url
        }

        const uploadedProofs=await Promise.all(
            proofFiles.map(async (file) => {
                const result=await uploadToCloudinary(file.buffer, {
                    folder: "crowdfund_campaign_proofs",
                    resourceType: "auto"
                })
                uploadedFiles.push(result)
                return {
                    url: result.secure_url,
                    name: file.originalname,
                    type: file.mimetype,
                    resourceType: result.resource_type
                }
            })
        )

        //get data from req body
        const campaignObj={
            ...req.body,
            goalAmount: Number(req.body.goalAmount),
            image: campaignImageUrl,
            proofFiles: uploadedProofs,
            // get createdBy id from decoded token
            createdBy: req.user?.id 
        }
        const result=await CampaignModel.create(campaignObj)
        //send res
        res.status(201).json({message:"Campaign created",payload:result})
    }catch(error){ //error message
        if(uploadedFiles.length){
            console.error("Campaign upload rollback needed:", uploadedFiles.map(file => file.public_id))
        }
        res.status(500).json({message:error.message})
    }
})

// get only APPROVED campaigns
campaignApp.get("/campaign",async (req, res) => {
    try{
        //get only the approved campaigns
        const campaignList=await CampaignModel.find({status:"APPROVED"}).sort({createdAt:-1})
        //send res
        res.status(200).json({message:"Campaign Approved",payload:campaignList})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

// get campaigns created by logged-in fundraiser
campaignApp.get("/my-campaigns",verifyToken("FUNDRAISER","ADMIN"),async (req, res) => {
    try{
        const query=req.user.role==="ADMIN" ? {} : {createdBy:req.user.id}
        const campaigns=await CampaignModel.find(query).sort({createdAt:-1})
        res.status(200).json({message:"Your campaigns",payload:campaigns})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

//get campaign details by campaid id
campaignApp.get("/campaign/:id",async (req,res)=>{
    try{
        if(!isValidObjectId(req.params.id))
            return res.status(400).json({message:"Invalid campaign id"})
        //get campaign details by id
        const campaign=await CampaignModel.findById(req.params.id).populate("createdBy","name email")
        if(!campaign)
            return res.status(404).json({message:"Campaign not found"})
        //send res
        res.status(200).json({message:"Campaign Details:",payload:campaign})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

// update campaign only by the fundraiser who created the campaign
campaignApp.put("/campaign/:id",verifyToken("FUNDRAISER","ADMIN"),async (req, res) => {
    try{
        //get id 
        const campaignId=req.params.id
        //find by campaignId and update
        const campaign=await CampaignModel.findById(campaignId)
        //if not found
        if(!campaign)
            return res.status(404).json({message:"Campaign not found"})
        //check ownership
        if(req.user.role!=="ADMIN" && campaign.createdBy.toString()!==req.user.id)
            return res.status(403).json({message:"Not allowed"})
        //update campaign
        const allowedUpdates=["title","description","story","category","image","goalAmount","deadline"]
        const updates=Object.fromEntries(
            Object.entries(req.body).filter(([key]) => allowedUpdates.includes(key))
        )
        if(updates.goalAmount)
            updates.goalAmount=Number(updates.goalAmount)
        const updated=await CampaignModel.findByIdAndUpdate(
            campaignId,
            {$set:updates},
            {returnDocument:'after',runValidators:true}
        )
        //send res
        res.status(200).json({message:"Campaign updated",payload:updated})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

// delete campaign nly by the fundraiser who created the campaign -- soft delete
campaignApp.delete("/campaign/:id",verifyToken("FUNDRAISER","ADMIN"),async (req, res) => {
    try{
        //get campaignId from decodedToke
        const campaignId=req.params.id
        //find by campaignId 
        const campaign=await CampaignModel.findById(campaignId)
        //if not found
        if(!campaign)
            return res.status(404).json({message:"Campaign not found"})
        //check ownership
        if (req.user.role!=="ADMIN" && campaign.createdBy.toString()!==req.user.id)
            return res.status(403).json({message:"Not allowed"})
        //delete
        await CampaignModel.findByIdAndDelete(campaignId)
        //send res
        res.status(200).json({message:"Campaign deleted"})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})
