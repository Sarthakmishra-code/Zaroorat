import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("uploadOnCloudinary called with:", localFilePath);
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        try { fs.unlinkSync(localFilePath); } catch (e) { }
        return response;

    } catch (error) {
        fs.appendFileSync('cloudinary_err.log', `Cloudinary Error: ${error.message} \n ${error.stack}\n`);
        try { fs.unlinkSync(localFilePath); } catch (e) { }
        return null;
    }
}

const deleteFromCloudinary = async (publicIds = []) => {
    try {
        if (!publicIds.length) return;

        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw error;
    }
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}