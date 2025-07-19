
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js"
import { json } from "express";
import jwt from 'jsonwebtoken'
// import { generateToken } from "../lib/utils.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// OLD register
// export const register = async (req, res) => {
//   const { username, password, interests } = req.body;
//   try {
//       if (!username || !password || !interests) {
//           return res.status(400).json({ message: "All fields are required" });
//       }

//       if (password.length < 6) {
//           return res.status(400).json({ message: "Password must be at least 6 characters" });
//       }

//       const user = await User.findOne({ username });
//       if (user) return res.status(400).json({ message: "User already exists" });

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       let interestsArray = [];
//       if (typeof interests === "string") {
//           interestsArray = interests.split(",").map(i => i.trim()).filter(i => i.length > 0);
//       } else if (Array.isArray(interests)) {
//           interestsArray = interests.filter(i => i.length > 0);
//       }

//       const newUser = new User({
//           username,
//           password: hashedPassword,
//           interests: interestsArray
//       });

//       if (newUser) {
//           generateToken(newUser._id, res);
//           await newUser.save();

//           res.status(201).json({
//               message:"Registered Successfully",
//               user: newUser.username,
//               interests:newUser.interests
//           });
//       } else {
//           res.status(400).json({ message: "Invalid user data" });
//       }
//   } catch (error) {
//       console.log("Error in signup controller", error.message);
//       res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// export const login =async(req,res)=>{
//   const {username,password}=req.body
//   try {
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     generateToken(user._id, res);

//     res.status(200).json({
//       message:"Login succesfully",
//       user:user.username,
//       interests:user.interests
//     });
//   } catch (error) {
//     console.log("Error in login controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }
// export const logout = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 0 });
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     console.log("Error in logout controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// export const checkAuth = async (req, res) => {
//   try {
//       if (!req.user) {
//           return res.status(401).json({ message: "Not authenticated" });
//       }
//       res.status(200).json(req.user);
//   } catch (error) {
//       console.error("Error in checkAuth:", error);
//       res.status(500).json({ error: "Internal server error" });
//   }
// };

// NEW 
const generateRefreshAndAccessTokens=async(userId)=>{
  try {
    const user=await User.findById(userId)
    const accessToken=user.generateAceessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshTokens=refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500,"Somthing is wrong while generating access tokens")
  }
}

const register=asyncHandler(async(req,res)=>{
  // get deatils from frontend
  // validation
  // check already exits(by username or email)
  // take interset and seprate the by comma or direct if drop down menu
  // create user object and create entry in db
  // remove password and refeshtoken field from response
  // check for user ceration 
  // return res

  // 1
  const {username,email,password,fullname,interests}=req.body
//  2

  if (
  [username, email, password, fullname].some(
    (field) => !field || typeof field !== "string" || field.trim() === ""
  ) ||
  !Array.isArray(interests) || interests.length === 0
) {
  throw new ApiError(400, "All fields are required, including at least one interest");
}

if(password.length<6){
  throw new ApiError(401,"Password must be 6 characters")
}

  // 3
  const existedUser=await User.findOne({
    $or:[{username},{email}]
  })
  
  if(existedUser){
    throw new ApiError(400,"User is already existed")
  }

  const user=await User.create({
    fullname,
    email:email.toLowerCase(),
    username:username.toLowerCase(),
    password,
    interests
  })

  const createdUser= await User.findById(user._id).select(
    "-password -refreshTokens"
  )

  if(!createdUser){
    throw new ApiError(500,"Somthing wnet wrong while registering the user")
  }
  
  return res
  .status(201)
  .json(new ApiResponse(201,createdUser,"User Registered Successfully"))


})

const login=asyncHandler(async(req,res)=>{
  // take the data from body
  // username or emial
  // find the user
  // password check
  // access and refershtokens
  // remove password and refreshTokens from response
  // send cookie
  // send response

  // 1

  const {username,email,password}=req.body
  if(!username && !email){
    throw new ApiError(400,"Username or email is required")
  }
  // 2
  const user=await User.findOne({
    $or:[{username},{email}]
  })
  if(!user){
    throw new ApiError(404,"User not found")
  }

  // 4
  const isPasswordValid=await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(401,"Password is incorrect")
  }

  // 5
  const {accessToken,refreshToken}=await generateRefreshAndAccessTokens(user._id)

  // 6
  const loggedUser=await User.findById(user._id).select("-password -refreshToken")
// 7 and 8
const isProduction = process.env.NODE_ENV === "production";
  const options ={
    httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax"
  }


  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(200,{user:loggedUser,accessToken,refreshToken},"User logged in Successfully"))
})

const logout=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,
    {
      $set:{refreshTokens:undefined}
    },{
      new:true
    }
  )
  const isProduction = process.env.NODE_ENV === "production";

  const options ={
    httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax"
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logout Successfully"))
})

const changecurrentPassword=asyncHandler(async(req,res)=>{
  const {oldPassword,newPassword}=req.body
  if(!oldPassword||!newPassword){
    throw new ApiError(400,"All feilds are required")
  }

  const user=await User.findById(req.user._id)

  const isPasswordvalid=await user.isPasswordCorrect(oldPassword)

  if(!isPasswordvalid){
    throw new ApiError(400,"Old password is incorrect")
  }

  user.password=newPassword
  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password chnaged Successfully"))

})

const getcurrentuser=asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200,req.user,"User fetched Successfully"))
})


const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized refresh-token request")
  }

 try {
   const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
   if(!decodedToken){
     throw new ApiError(401,"Token not decoded")
   }
 
   const user=await User.findById(decodedToken._id).select("-password")
   if(!user){
     throw new ApiError(401,"Invalid refersh-token")
   }
 
   if(incomingRefreshToken!==user?.refreshTokens){
     throw new ApiError(401,"Refresh token is expired or used")
   }
   const isProduction = process.env.NODE_ENV === "production";
 
   const options={
            httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax"
         }
   const {accessToken,refreshToken}=await generateRefreshAndAccessTokens(user._id)
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(new ApiResponse(200,{accessToken,refreshToken},"Access-token refershed"))
 } catch (error) {
  throw new ApiError(401,error?.message || "invalid refersh token")
 }
  


})


const updateAccountDetails=asyncHandler(async(req,res)=>{
  const {fullname,email}=req.body

  if(!fullname || !email){
    throw new ApiError(400,"All fields are required")
  }

  const user=await User.findByIdAndUpdate(req.user._id,
    {
      $set:{
        fullname:fullname,
        email:email.trim().toLowerCase()
      }
    },
    {
      new:true,
      runValidators:true
    }
  ).select("-password")

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200,user,"Account detais updated successfully"))


})

const updateUserInterests=asyncHandler(async(req,res)=>{
  const {interests}=req.body
  if (!Array.isArray(interests) || interests.length === 0) {
    throw new ApiError(400, "At least one interest must be selected");
  }
console.log(interests)
  const user = await User.findByIdAndUpdate(
    req.user._id,
     { interests },
    { new: true }
  ).select("-password -refreshTokens");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Interests updated successfully"));
})

const updateUserRoleBySuperAdmin=asyncHandler(async(req,res)=>{
  const {id}=req.params
  const {role}=req.body

  const user=await User.findByIdAndUpdate(id,{role}, { new: true, validateBeforeSave: false })
  .select("-password -refreshTokens")

  if (!user) {
    throw new ApiError(404, "User not found for role updation");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, user, `User role updated to '${role}'`)
  );
})

const searchUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.query;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  const user = await User.findOne({ username: username.toLowerCase() }).select("-password -refreshTokens");
  console.log("user found bu username:",user)

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});
export {
  register,
  login,
  logout,
  changecurrentPassword,
  getcurrentuser,
  refreshAccessToken,
  updateAccountDetails,
  updateUserInterests,
  updateUserRoleBySuperAdmin,
  searchUserByUsername
}