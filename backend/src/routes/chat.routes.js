import { Router } from "express";
import { verifyAuth } from "../middlewares/user.middleware.js";
import { getStreamToken } from "../controllers/chat.controls.js";

const router = Router();

router.route("/token").get(verifyAuth, getStreamToken)

export default router;