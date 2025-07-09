import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


import Dbconnection  from "./utilities/database.js";
import router  from "./routes/authRoutes.js";

dotenv.config()
const server = express();
server.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
server.use(express.json());
server.use(cookieParser());

server.use("/api/auth", router);

const startserver = async () => {
  try {
    await Dbconnection(); 
    const PORT = process.env.PORT || 8001;
    server.listen(PORT, ()=>{
      console.log(`Server running on Port: ${PORT}`)
    })
  } catch (error) {
    console.error("Error connecting to MongoDb: ", error);
  }
}

startserver();