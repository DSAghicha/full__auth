import cors from "cors"
import express, { json, urlencoded } from "express"
import helmet from "helmet"
import mongoose from "mongoose"
import morgan from "morgan"
import { ACCESS_TOKEN, PORT, REFRESH_TOKEN, URI } from "./constants"
import { Interceptors } from "./middlewares"
import { authRouter } from "./routes"

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(Interceptors.appConfig)

//! Setting up routes
app.get("/api", (_, res) => res.send("Available"));
app.use("/api/auth", authRouter);

//! MONGODB & SERVER SETUP
if (!URI) throw "Cannot connect to mongodb";
//! CHECKING REQUIRED ENV SETUP
if (!ACCESS_TOKEN || !REFRESH_TOKEN || !PORT) throw "Configuration error!";

mongoose
    .connect(URI, { dbName: "authTest" })
    .then(async () => {
        app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
    })
    .catch((err: any) => console.log(`Failed to connect to db.`, err));
