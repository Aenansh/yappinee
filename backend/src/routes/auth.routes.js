import { Router } from "express";
import {
  onBoardUser,
  signInUser,
  signOutUser,
  signUpUser,
} from "../controllers/auth.controls.js";
import { verifyAuth } from "../middlewares/user.middleware.js";

const router = Router();

router.route("/sign-up").post(signUpUser);
router.route("/sign-in").post(signInUser);
router.route("/sign-out").post(signOutUser);
router.route("/onboarding").post(verifyAuth, onBoardUser);
router.route("/me").get(verifyAuth, (req, res) => {
  return res
    .status(200)
    .json({ message: "You are authorized!", user: req.user });
});

export default router;
