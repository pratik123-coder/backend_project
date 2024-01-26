import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler ( async (req,res) => {
  //get user details from frontend
  //validation of data - not empty
  //check if user exists : email
  //check for images, check for avtar
  //uploadto cloudinary if avaliable
  //create user object - add to db
  //remove password and refreshtoken from response.data
  //check for user creation 
  //return res

  const {fullName,email,username,password}=req.body
  console.log("email:",email);


  if(
    [fullName,email,username,password].some((field) => field?.trim() === "")
  ){
    throw new ApiError(400,"Field is missing");
  }
  const existedUser = User.findOne({
    $or:[{email},{username}]
  })
  if(existedUser){
    throw new ApiError(409,"User / Email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if(!avatar){
    throw new ApiError(400,"Avatar file is required");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
  }
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Successfully created")
  )

})

export {registerUser};