import dotenv from 'dotenv';

dotenv.config()

const config = {
    PORT : process.env.PORT || 5000,
    MONGODB_URL : process.env.MONGODB_URL || "mongodb://localhost:27017/uptimedowntime",
    JWT_SECRET : process.env.JWT_SECRET || "yoursecret",
    JWT_EXPIRY : process.env.JWT_EXPIRY || "30d",
    cloud_name : process.env.cloud_name,
    api_key : process.env.api_key,
    api_secret : process.env.api_secret,
    folderName : process.env.folderName,
    REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY : process.env.REFRESH_TOKEN_EXPIRY
}

export default config