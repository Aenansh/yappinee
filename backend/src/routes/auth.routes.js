import { Router } from "express";
import { signInUser, signOutUser, signUpUser } from "../controllers/auth.controls.js";

const router = Router();

router.route("/sign-up").post(signUpUser);

router.route("/sign-in").post(signInUser);

router.route("/sign-out").post(signOutUser);

export default router;