import dotenv from 'dotenv'

dotenv.config();

export const mongoURI = process.env.MONGO_URI

export const secret = process.env.JWT_SECRET