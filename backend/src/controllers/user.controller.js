import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
    const {name,age,address,aadhaarCardNumber,password,email,role}=req.body

    if(!name||!age||!address||!aadhaarCardNumber||!password)
    {
        throw new ApiError(400,"all fields are required")
    }

    const existedUser = await User.findOne({aadhaarCardNumber})

    if(existedUser){
        throw new ApiError(409,"user already existed");    
    }
    const user = await User.create({
        name,
        age,
        address,
        password,
        aadhaarCardNumber,
        email:email || "",role
    })
    const accessToken = user.generateAccessToken()
    const createdUser = await User.findById(user._id).select("-password")

    return res.status(201).json(
        new ApiResponse(200,{user:createdUser,accessToken},"user registered successfully")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    const{aadhaarCardNumber,password}=req.body
    if(!aadhaarCardNumber||!password){
        throw new ApiError(400,"aadhaar card number and password both are required")
    }
    const user = await User.findOne({aadhaarCardNumber})
    if(!user){
        throw new ApiError(400,"user not found")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"invalid user credentials")
    }
    const accessToken = user.generateAccessToken()

    const loggedInUser = await User.findById(user._id).select("-password")

    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,{user:loggedInUser,accessToken},"user loggedIn successfully")
    )
})
const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"))
})
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword}=req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect =await user.isPasswordCorrect(oldPassword)
     
    if(!isPasswordCorrect){
        throw new ApiError(400,"invalid password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))
})
export{
    registerUser,
    loginUser,
    getCurrentUser,
    changeCurrentPassword
}