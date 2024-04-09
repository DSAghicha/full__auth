import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { resolve } from "path";

//! CONFIGURATIONS
dotenv.config({ path: resolve(__dirname, "../config.env") });
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

//! MONGODB & SERVER SETUP
const URI = process.env.MONGO_URL;
const PORT = process.env.PORT;
if (!URI) throw "Cannot connect to mongodb";

mongoose
    .connect(URI, { dbName: "authTest" })
    .then(async () => {
        app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
    })
    .catch((err: any) => console.log(`Failed to connect to db.`, err));
