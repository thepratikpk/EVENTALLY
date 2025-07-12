import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary =async(localFilePath)=>{
    try{
        if(!localFilePath){
            return null;
        }
        const reponse=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // file upload on cloudinary successfully
        console.log("File uploaded on Cloudinary!!")
        fs.unlinkSync(localFilePath)
        return reponse;
    }catch(err){
        console.log("Cloudinary upload error: ",err)
        // remove locally saved temp files
        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath)
        }
    }
}

export {uploadOnCloudinary}