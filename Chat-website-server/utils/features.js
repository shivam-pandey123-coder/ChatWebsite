import mongoose from "mongoose"
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv';

import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";
import {v4 as uuid} from 'uuid';



dotenv.config({
    path:'../.env',
});

const cokkieOption = {
    maxAge:24 * 60 * 60 * 1000,
    sameSite:"none",
    httpOnly:true,
    secure:true
}

const connectDB = (uri)=>{
    mongoose.connect(uri,{dbName:"chattu"}).then((data)=> console.log(`connected to DB: ${data.connection.host}`))
    .catch((err)=>{
        throw err
    });
};

const sendToken = (res,user,code,message)=>{
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);

    return res.status(code).cookie("chattu-token",token,cokkieOption).json({
        succes:true,
        user,
        message,    
    });
};

const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io");
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event, data);
  };
  


const uploadFilesToCloudinary = async (files=[]) => {
    const uploadPromises = files.map((file)=>{
        return new Promise((resolve,reject)=>{
            cloudinary.uploader.upload(getBase64(file),{
                resource_type:"auto",
                public_id:uuid(),
            },(error,result)=>{
                if(error) return reject(error);
                resolve(result)
            });
        });

    });

    try {
        const results = await Promise.all(uploadPromises);
        const formatedResults = results.map((result)=>({
            public_id:result.public_id,
            url:result.secure_url
        }));
        return formatedResults;
    } catch (error) {
        throw new Error("Error uplaoding files to cloudinary",error);
    }
  
}

const deleteFileFromCloudinary = async(public_id)=>{
    //Delete files from cloudinary
}

export {connectDB, sendToken, cokkieOption,emitEvent,deleteFileFromCloudinary,uploadFilesToCloudinary}