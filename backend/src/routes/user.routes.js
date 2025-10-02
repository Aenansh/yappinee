import { Router } from "express";
import { verifyAuth } from "../middlewares/user.middleware.js";
import {
  acceptFriendRequest,
  fetchAllRequests,
  getMyFriends,
  getOutGoingRequests,
  recommendedUsers,
  rejectFriendRequest,
  removeAsFriend,
  sendFriendRequest,
} from "../controllers/user.controls.js";

const router = Router();

router.use(verifyAuth);

router.route("/").get(recommendedUsers);
router.route("/friends").get(getMyFriends);
router.route("/friend-request/:id").post(sendFriendRequest);
router.route("/friend-request/:id/accept").put(acceptFriendRequest);
router.route("/friend-requests").get(fetchAllRequests);
router.route("/outgoing-friend-requests").get(getOutGoingRequests);
router.route("/friend-request/:id/reject").put(rejectFriendRequest);
router.route("/unfriend/:id").put(removeAsFriend);

export default router;
