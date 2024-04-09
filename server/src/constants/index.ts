import dotenv from "dotenv";
import { resolve } from "path";

//! CONFIGURATIONS
dotenv.config({ path: resolve(__dirname, "../../config.env") });

export const PORT = process.env.PORT;
export const URI = process.env.MONGO_URL;
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN as string;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string;
