import express from "express";
import { getAllUsers, update } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const user = express.Router();

user.get("/all", getAllUsers);
user.put("/update", verifyToken, update);

export default user;
