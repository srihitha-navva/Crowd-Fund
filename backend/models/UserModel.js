//UserModel.js

import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name required"],
        trim: true
    },
    mobile: {
        type: String,
        required: [true, "Mobile Number required"],
        match: [/^[0-9]{10}$/, "Enter valid mobile number"]
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Enter valid email"]
    },
    password: {
        type: String,
        required: [true, "Password required"],
        minlength: 6
    },
    role: {
        type: String,
        enum: ["DONOR", "FUNDRAISER", "ADMIN"],
        default: "DONOR"
    },
    profileImage: {
        type: String
    }
},{
    timestamps: true,
    versionKey: false
})

export const UserModel = model("user", userSchema)