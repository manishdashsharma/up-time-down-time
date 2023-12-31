import User from '../models/user.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../services/CustomError.js'
import crypto from "crypto"
import cloudinary from "../config/cloudinary.config.js";
import config from './../config/index.js';
import JWT from "jsonwebtoken";

/**
 * Generates access and refresh tokens for a given user ID.
 */
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefeshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new CustomError("Something went wrong while generating referesh and access token",500)
    }
}

/**
 * Handles user sign-up, creating a new user profile.
 * Validates required fields and checks for existing users.
 * Registers a new user and returns a success message along with user details (excluding sensitive data like password and refresh token).
 */
const signUp = asyncHandler(async (req, res) => {
  const { name,username, email, password, phoneNumber } = req.body;

  if ([name, username, email, password].some((field) => field?.trim()=== "")) {
      throw new CustomError("Please add all fields", 400);
  }

  const existingUser = await User.findOne({ 
    $or: [{ username }, { email }]
   });

  if (existingUser) {
      throw new CustomError("User already exists", 400);
  }

  const users = await User.create({
      name,
      username : username.toLowerCase(),
      email,
      password,
      phoneNumber
  });

  const user = await User.findById(users._id).select("-password -refreshToken");

  if (!user) {
    throw new CustomError("Something went wrong while registering the user",500)
  }

  return res
  .status(201)
  .json({
    success: true,
    message: "User registered successfully",
    user
  })
});

/**
 * Manages user login functionality.
 * Validates provided username and password.
 * Checks credentials and generates access and refresh tokens upon successful login.
 * Returns user details (excluding sensitive data like password and refresh token) along with access and refresh tokens as cookies.
 */
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new CustomError("Please provide both username and password", 400);
    }

    const users = await User.findOne({ username }).select('+password');

    if (!users) {
        throw new CustomError("Invalid credentials", 400);
    }

    const isPasswordMatched = await users.comparePassword(password);

    if (!isPasswordMatched) {
        throw new CustomError("Invalid credentials", 400);
    }

    const user = await User.findById(users._id).select("-password -refreshToken");

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(users._id);

    const cookieOptions = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
            success: true,
            message: "User logged in successfully",
            user,
            accessToken,
            refreshToken
        });
});

/**
 * Handles user logout by invalidating the refresh token.
 * Clears access and refresh token cookies upon successful logout.
 */
const logout = asyncHandler(async (req, res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken: undefined
        },
        {
            new: true,
            runValidators: true,
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        success: true,
        message: "User logged out successfully"
    })
})

/**
 * Retrieves the profile details of the currently logged-in user.
 * Returns user information for the authenticated user.
 */
const getProfile = asyncHandler( async(req, res) => {
    const user = req.user
    return res
    .status(200)
    .json({
        success: true,
        message: "Current logged in user details",
        user
    })

})

/**
 * Updates the address information for the logged-in user.
 * Retrieves the user information from the request and updates the address details.
 * Returns a success message along with the updated user information (excluding sensitive data like password and refresh token).
 */
const updateUserAddress = asyncHandler( async (req, res) => {
    const { user : userinfo } = req
    const { address } = req.body
  
    if(!userinfo) {
      new CustomError("User not found",404)
    }
  
    const user = await User.findByIdAndUpdate(
      userinfo._id, { address } ,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken")
  
    if (!user) {
      new CustomError("User info could not update",400)
    }
  
    return res
    .status(200)
    .json({
      success: true,
      message: "User address updated successfully",
      user
    })
})

/**
 * Updates the profile image for the logged-in user.
 * Parses the form data using 'formidable' to handle file uploads.
 * Retrieves the user information from the request and uploads the new profile image to Cloudinary.
 * Updates the user's profile image URL and returns a success message along with the updated user information.
 */
const updateProfileImage = asyncHandler(async (req, res) => {
    const form = formidable({ multiples: true, keepExtensions: true });

    form.parse(req, async function (error, fields, files) {
        if (error) {
        throw new CustomError(error.message || 'Something went wrong', 500);
        }

        const { user } = req;

        const upload = await cloudinary.v2.uploader.upload(files.profileImage.filepath, {
            folder: config.profileImageFolder
        });

        user.profileImage = upload.secure_url ;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            user
        })
    })
})

/**
 * Refreshes the access token using the provided refresh token.
 * Retrieves the refresh token from cookies or the request body.
 * Verifies the refresh token, generates a new access token, and returns it.
 */
const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new CustomError("Unauthorized request", 401);
    }

    try {
        const decodedToken = JWT.verify(
            incomingRefreshToken,
            config.REFRESH_TOKEN_SECRET
        )
        
        const user = await User.findById(decodedToken?._id)

        if(!user) {
            throw new CustomError("Invalid refresh token", 401);
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new CustomError("Refresh token has expired", 401)
        }

        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "Access token has been refreshed successfully",
            accessToken,
            refreshToken,
        })
    } catch (error) {
        throw new CustomError("Invalid refresh token" || error?.message,401)
    }
})

/**
 * Changes the current user's password.
 * Validates the old password, ensuring it matches before changing to a new password.
 */
const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id).select('+password')
    
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    
    if (!isPasswordCorrect) {
        throw new CustomError("Old password is incorrect",400)
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json({
        success: true,
        message: "Password changed successfully"
    })
})

export {
    signUp,
    login,
    logout,
    getProfile,
    updateProfileImage,
    updateUserAddress,
    refreshAccessToken,
    changeCurrentPassword
}