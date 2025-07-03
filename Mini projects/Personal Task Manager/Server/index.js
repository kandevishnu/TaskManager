import express from "express";
import dotenv from "dotenv";
const server = express();

dotenv.config()
server.get("/", (req, res) => {
  res.send("hello");
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
