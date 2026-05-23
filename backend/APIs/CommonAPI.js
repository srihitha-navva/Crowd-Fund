// CommonAPI.js

import exp from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

const { sign } = jwt;

export const commonApp=exp.Router();

//register
commonApp.post("/users",upload.single("profileImage"),async (req, res, next) => {
  let cloudinaryResult
  try{
    const newUser=req.body
    const allowedRoles=["DONOR", "FUNDRAISER"]
    if(!allowedRoles.includes(newUser.role))
      return res.status(400).json({message:"Invalid role"})
    // upload image if exists
    if(req.file){
      cloudinaryResult=await uploadToCloudinary(req.file.buffer)
      newUser.profileImage=cloudinaryResult?.secure_url
    }
    // hash password
    newUser.password=await hash(newUser.password,10)
    // save user
    await UserModel.create(newUser)
    // send res
    res.status(201).json({message:"User created successfully"})
  }catch(err){
    console.log("Register error:",err.message)
    // rollback image
    if(cloudinaryResult?.public_id)
      await cloudinary.uploader.destroy(cloudinaryResult.public_id)
    next(err)
  }
})

//login
commonApp.post("/login",async (req, res) => {
  try{
    //get email, password frm body
    const { email,password }=req.body
    //find email
    const user= await UserModel.findOne({email})
    //no email found
    if(!user)
      return res.status(400).json({ message:"Invalid email"})
    //if email found check password
    const isMatched=await compare(password,user.password)
    //if not matched
    if (!isMatched)
      return res.status(400).json({message:"Invalid password"})
    //if matched create token(jwt)
    const token=sign({id:user._id,email:user.email,role:user.role},process.env.SECRET_KEY,{expiresIn:"10h"})
    //set token to res header as httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    })
    //convert document into js obj
    const userObj = user.toObject()
    //remove password from user document
    delete userObj.password
    //send res
    res.status(200).json({message:"Login successful",payload: userObj})
  }catch(err){
    res.status(500).json({message:err.message })
  }
})

//logout
commonApp.get("/logout",(req, res) => {
    //delete token frm cookie storage
    res.clearCookie("token",{
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    //send res
    res.status(200).json({message:"Logout successful"})
})

//change password
commonApp.put("/password",verifyToken("DONOR","FUNDRAISER","ADMIN"),async (req, res) => {
  try{
    //get current pass adn new pass frm req
    const {currentPassword,newPassword}=req.body
    //get user id frm toke na find user in db
    const user=await UserModel.findById(req.user?.id)
    //if no user found
    if(!user) 
      return res.status(404).json({message:"User not found"})
    //check if current pass and new pass are same
    if(currentPassword===newPassword)
      return res.status(400).json({message:"New password cannot be same as old password"})
    //get current password and comapre
    const isMatch=await compare(currentPassword,user.password)
    //if not matched
    if (!isMatch)
      return res.status(400).json({message:"Current password incorrect"})
    //hash new password and replace
    user.password = await hash(newPassword,10)
    await user.save()
    //send res
    res.status(200).json({message:"Password updated successfully"})
  }catch(err){
    res.status(500).json({message:err.message})
  }
})

//page refresh
commonApp.get("/check-auth",verifyToken("DONOR","FUNDRAISER","ADMIN"),async (req, res) => {
  try {
    const user = await UserModel.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({message: "Authenticated",payload: user});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
})
