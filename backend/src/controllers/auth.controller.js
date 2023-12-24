import User from '../models/user.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../services/CustomError.js'
import crypto from "crypto"
import AuthRoles from "../utils/authRole.js";
import cloudinary from "../config/cloudinary.config.js";
import config from './../config/index.js';


export const getProfile = asyncHandler( async(req, res) => {
    const {name} = req.body

    if(!name){
        throw new CustomError("User not found",401)
    }
  
    res.status(200).json({
        success: true,
        name
    })

})
