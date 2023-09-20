import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
import db from "./src/config/db.js";

dotenv.config();

db();

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200,
  };
app.use(cors(corsOptions));

app.use(express.json()); // handle body object from requests

app.use("/users", userRoutes);

app.use("/images", express.static("./server/uploads"));

app.listen(5000, () => console.log("Server is up and running at port 5000"));
