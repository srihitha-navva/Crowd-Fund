//server.js

import exp from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import { adminApp } from './APIs/AdminAPI.js'
import { campaignApp } from './APIs/CampaignAPI.js';
import { commonApp } from './APIs/CommonAPI.js';
import { donationApp } from './APIs/DonationAPI.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
config()

//express app 
const app = exp()


app.use(cors({
  origin: "https://crowd-fund-sage.vercel.app",
  credentials: true
}))

app.use(cookieParser())
app.use(exp.json())

//routes
app.use("/admin-api",adminApp)
app.use("/campaign-api",campaignApp)
app.use("/auth",commonApp)
app.use("/donation-api",donationApp)

//assign port number
const port = process.env.PORT || 4000

let isConnected = false

//connect to DB
const connectDB = async () => {
    if (isConnected) return
    try {
        await connect(process.env.DB_URL)
        isConnected = true
        console.log("DB connected")
    } catch (err) {
        console.error("DB connection error:", err.message)
        process.exit(1); 
    }
};

//call DB to connect then server should run
const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

//after DB connect server should run
startServer();
