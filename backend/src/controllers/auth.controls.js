import { emailRegex, passwordRegex } from "../constants.js";
import { createStreamUser } from "../lib/stream.js";
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
    }+${fullName.split(" ")[1] || fullName.split(" ")[0][1].toUpperCase()}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: avatar,
    });

    try {
      await createStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });

      console.log(`Stream created for user ${newUser._id}`);
    } catch (error) {
      console.log("Error occured while creating stream for user", error);
    }

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

    res.status(201).json({
      success: true,
      user: newUser,
      message: "Signed Up successfully!",
    });
  } catch (error) {
    console.log("Error in controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((e) => e.trim() === "")) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "New user detected! Try signing up." });
    }

    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return res.status(401).json({ error: "Inavalid password! Try again." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res
      .status(200)
      .json({ success: true, user, message: "Signed in successfully!" });
  } catch (error) {
    console.log("Error in sign in controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const signOutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res
      .status(200)
      .json({ success: true, message: "Signed out successfully!" });
  } catch (error) {
    console.log("Error occured in signout user controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const onBoardUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      [fullName, bio, nativeLanguage, learningLanguage, location].some(
        (e) => !e || e.trim() === ""
      )
    )
      return res.status(400).json({
        error: "All fields are required!",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res
        .status(409)
        .json({ error: "Couldn't update the user profile! Try again" });

    try {
      await createStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (error) {
      console.log(
        "Error occured while updating stream after onboarding",
        error
      );
    }
    return res.status(201).json({
      success: true,
      user: updatedUser,
      message: "Successfully Onboarded!",
    });
  } catch (error) {}
};
