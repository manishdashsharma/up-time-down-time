import User from '../models/user.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../services/CustomError.js'
import crypto from "crypto"
import cloudinary from "../config/cloudinary.config.js";
import config from './../config/index.js';


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

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(users._id.toString());

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

const updateUserAddress = asyncHandler( async (req, res) => {
    const { user : userinfo } = req
    const { address } = req.body
  
    if(!userinfo) {
      new CustomError("User not found",404)
    }
    console.log(userinfo._id);
  
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


export {
    signUp,
    login,
    logout,
    getProfile,
    updateProfileImage,
    updateUserAddress

}