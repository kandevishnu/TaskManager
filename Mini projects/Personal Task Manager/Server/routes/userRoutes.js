import express from "express";
import { deleteUser, getAllUsers, update } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const user = express.Router();

user.get("/all", getAllUsers);
user.put("/update", verifyToken, update);
user.delete("/delete", verifyToken, deleteUser);

export default user;
