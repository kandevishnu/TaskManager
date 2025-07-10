import User from "../models/userModel.js"; // adjust path as needed

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // fetches all users
    res.status(200).json({users: users, length: users.length});     // sends back user list
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const update = async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
