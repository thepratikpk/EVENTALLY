import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
  const { username, password, interests } = req.body;
  try {
      if (!username || !password || !interests) {
          return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const user = await User.findOne({ username });
      if (user) return res.status(400).json({ message: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let interestsArray = [];
      if (typeof interests === "string") {
          interestsArray = interests.split(",").map(i => i.trim()).filter(i => i.length > 0);
      } else if (Array.isArray(interests)) {
          interestsArray = interests.filter(i => i.length > 0);
      }

      const newUser = new User({
          username,
          password: hashedPassword,
          interests: interestsArray
      });

      if (newUser) {
          generateToken(newUser._id, res);
          await newUser.save();

          res.status(201).json({
              message:"Registered Successfully",
              user: newUser.username,
              interests:newUser.interests
          });
      } else {
          res.status(400).json({ message: "Invalid user data" });
      }
  } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login =async(req,res)=>{
  const {username,password}=req.body
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message:"Login succesfully",
      user:user.username,
      interests:user.interests
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ message: "Not authenticated" });
      }
      res.status(200).json(req.user);
  } catch (error) {
      console.error("Error in checkAuth:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};