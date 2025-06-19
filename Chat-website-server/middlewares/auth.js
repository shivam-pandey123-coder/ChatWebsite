import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { adminSecretKey } from "../app.js";
import { CHATTU_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";

dotenv.config({
    path:'../.env'
})


const isAuthenticated = TryCatch( async(req,res,next) => {
    const token = req.cookies[CHATTU_TOKEN];
   
    if(!token) return next(new ErrorHandler('please login to access this route',401))
   
        const decodedData =  jwt.verify(token,process.env.JWT_SECRET);
         req.user = decodedData._id;
    next()
});

const adminOnly =  TryCatch(async(req,res,next) => {
    const token = req.cookies['chattu-admin-token'];
    
    if(!token) return next(new ErrorHandler('Only admin can access this route',401))
   
        const secretKey =  jwt.verify(token,process.env.JWT_SECRET);
        const isMatched = secretKey == adminSecretKey

        if(!isMatched) return next(new ErrorHandler('Invalid admin Key',401));

         
    next()
}
);

const socketAuthenticator = async (err,socket,next) => {
    try {
        if(err){
            return next(err)
            
        }

        const authToken = socket.request.cookies[CHATTU_TOKEN];
        if(!authToken) next(new ErrorHandler("please login to access this route",401));

        const decodedData = jwt.verify(authToken,process.env.JWT_SECRET);

        const user = await User.findById(decodedData._id);
        
        if(!user) return next(new ErrorHandler("Please login to acces this route",401))
        
        socket.user = user

        return next()
        
        
    } catch (error) {
        
        return next(new ErrorHandler("please login to access thid route",401))
        
    }
    
}

export {isAuthenticated,adminOnly,socketAuthenticator}