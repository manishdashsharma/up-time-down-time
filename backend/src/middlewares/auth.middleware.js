import User from "../models/user.schema.js"
import JWT from "jsonwebtoken"
import asyncHandler from "../services/asyncHandler.js"
import config from "../config/index.js"
import CustomError from "../services/CustomError.js"


export const isLoggedIn = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    if (!token) {
      throw new CustomError("Not authorized to access this resource", 401);
    }
    
    try {
      const decodedJWTPayload = JWT.verify(token, config.JWT_SECRET);
      req.user = await User.findById(decodedJWTPayload?._id, "name email role phoneNumber address profileImage");
      next();
    } catch (error) {
      throw new CustomError("Not authorized to access this resource", 401);
    }
  });
