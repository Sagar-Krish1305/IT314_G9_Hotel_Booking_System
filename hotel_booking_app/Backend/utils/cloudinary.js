import { v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
}); 

const uploadOnCloudinary = async (localFilePath) => {
    try{

        // console.log(`${process.env.CLOUDINARY_CLOUD_NAME}, ${process.env.CLOUDINARY_API_KEY}, ${process.env.CLOUDINARY_API_SECRET}`)
        if(!localFilePath) return null

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            // folder : "Hotel-images",
            resource_type : "auto"
        })

        //file has been uploaded sucessfully
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    }catch (error){
        console.error("Cloudinary upload error:", error); 
        fs.unlinkSync(localFilePath)        // remove locally saved temporary file as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }
