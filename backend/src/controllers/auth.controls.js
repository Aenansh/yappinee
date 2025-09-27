import { emailRegex, passwordRegex } from "../constants.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const signUpUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some((e) => e.trim() === "")) {
      return res.status(400).json({
        error: "All fields are required!",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format!" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain atleast 8 characters, one lowercase, one uppercase, one number and one special character.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists! Try signing in.",
      });
    }

    const avatar = `https://avatar.iran.liara.run/username?username=${
      fullName.split(" ")[0]
    }+${fullName.split(" ")[1] || fullName.split(' ')[0][1].toUpperCase()}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: avatar,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in controller", error);
    return res.status(500).json({ error: "Failed to register the user!" });
  }
};

export const signInUser = async (req, res) => {
  res.send("Sign-in");
};

export const signOutUser = async (req, res) => {
  res.send("Sign-out");
};
