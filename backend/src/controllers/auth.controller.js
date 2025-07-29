import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library';

// Initialize Google OAuth2Client with your backend client ID
// Ensure GOOGLE_CLIENT_ID_BACKEND is set in your .env file
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_BACKEND);


const generateRefreshAndAccessTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAceessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshTokens=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something is wrong while generating access tokens")
    }
}

const register=asyncHandler(async(req,res)=>{
    const {username,email,password,fullname,interests}=req.body

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
        interests,
        isGoogleUser: false // Explicitly set for local registration
    })

    const createdUser= await User.findById(user._id).select(
        "-password -refreshTokens"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    
    return res
    .status(201)
    .json(new ApiResponse(201,createdUser,"User Registered Successfully"))
})

const login=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if(!username && !email){
        throw new ApiError(400,"Username or email is required")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User not found")
    }

    // Check if it's a Google user trying to log in with password
    if (user.isGoogleUser) {
        throw new ApiError(400, "This account is registered with Google. Please use 'Login with Google'.");
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Password is incorrect")
    }

    const {accessToken,refreshToken}=await generateRefreshAndAccessTokens(user._id)

    const loggedUser=await User.findById(user._id).select("-password -refreshToken")

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
        throw new ApiError(400,"All fields are required")
    }

    const user=await User.findById(req.user._id)

    if (user.isGoogleUser) {
        throw new ApiError(400, "Cannot change password for Google-linked accounts.");
    }

    const isPasswordvalid=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordvalid){
        throw new ApiError(400,"Old password is incorrect")
    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed Successfully"))

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
            throw new ApiError(401,"Invalid refresh-token")
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
        .json(new ApiResponse(200,{accessToken,refreshToken, user: user.toObject()},"Access-token refreshed"))
    } catch (error) {
    throw new ApiError(401,error?.message || "invalid refresh token")
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
    .json(new ApiResponse(200,user,"Account details updated successfully"))
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
    console.log("user found by username:", user)

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

const googleLogin = asyncHandler(async (req, res) => {
    const { idToken } = req.body; // Google ID token from frontend

    if (!idToken) {
        throw new ApiError(400, "Google ID token is required.");
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID_BACKEND, // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name: fullname, picture } = payload;

        if (!email) {
            throw new ApiError(400, "Google account must have an email.");
        }

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // User exists
            if (!user.googleId) {
                // Existing user (local login) trying to sign in with Google for the first time
                // Link Google ID to existing account if email matches
                user.googleId = googleId;
                user.isGoogleUser = true;
                await user.save({ validateBeforeSave: false }); // Skip password validation
            } else if (user.googleId !== googleId) {
                // This scenario should ideally not happen if email is unique and googleId is unique
                // It means an email collision between a local user and a Google user, or a different Google account using the same email.
                // For simplicity, we'll throw an error. In a real app, you might ask to link accounts.
                throw new ApiError(400, "An account with this email already exists. Please login with your password or link accounts.");
            }
            // If user exists and googleId matches, proceed to login
        } else {
            // User does not exist, register them
            // Create a unique username from email if not provided, or generate one
            const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''); // Basic username from email
            let finalUsername = username;
            let counter = 0;
            while (await User.findOne({ username: finalUsername })) {
                counter++;
                finalUsername = `${username}${counter}`;
            }

            user = await User.create({
                fullname: fullname || email, // Use name from Google, fallback to email
                email: email.toLowerCase(),
                username: finalUsername.toLowerCase(),
                googleId,
                isGoogleUser: true,
                // Passwords are not stored for Google users
                interests: [], // Default empty interests, user can update later
            });

            if (!user) {
                throw new ApiError(500, "Failed to create user with Google account.");
            }
        }

        // Generate tokens and send cookies
        const { accessToken, refreshToken } = await generateRefreshAndAccessTokens(user._id);
        const loggedUser = await User.findById(user._id).select("-password -refreshTokens");

        const isProduction = process.env.NODE_ENV === "production";
        const options = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax"
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: loggedUser, accessToken, refreshToken }, "Google login successful"));

    } catch (error) {
        console.error("Google login error:", error);
        throw new ApiError(401, error.message || "Google authentication failed.");
    }
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
    searchUserByUsername,
    googleLogin
}
