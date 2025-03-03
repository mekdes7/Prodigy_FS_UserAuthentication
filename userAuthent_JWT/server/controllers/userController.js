import UserModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
      const { userId } = req.body;
      console.log("User ID:", userId); 
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      return res.json({
        success: true,
        userData: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          isverified: user.isverified,
        },
      });
    } catch (error) {
      console.error("Error in getUserData:", error);
      res.status(500).json({ error: "Error getting user data", message: error.message });
    }
  };