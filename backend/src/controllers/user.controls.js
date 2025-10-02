import { FriendRequest } from "../models/FriendRequest.model.js";
import { User } from "../models/User.model.js";

export const recommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });

    return res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in recommended users controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    return res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getmyfriends controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    if (myId.equals(recipientId))
      return res
        .status(400)
        .json({ error: "You can't send friend request to yourself!" });

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ error: "No User Found!" });

    if (recipient.friends.includes(myId))
      return res.status(400).json({ error: "Already friends with this user!" });

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest)
      return res.status(400).json({ error: "Request is already pending!" });

    const newRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    if (!newRequest)
      return res
        .status(400)
        .json({ error: "Failed to send a friend request! Try again." });

    return res.status(201).json({
      success: true,
      message: "Request sent successfully!",
      friendRequest: newRequest,
    });
  } catch (error) {
    console.log("Error in friend request controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: friendRequestId } = req.params;
    const friendRequest = await FriendRequest.findById(friendRequestId);

    if (!friendRequest)
      res.status(404).json({ error: "No friend request found!" });

    if (req.user._id.toString() !== friendRequest.recipient.toString())
      res.status(403).json({
        error: "You are not authorized to accept this friend request!",
      });

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    return res.status(200).json({ message: "Friend Request Accepted!" });
  } catch (error) {
    console.log("Error in accept request controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const fetchAllRequests = async (req, res) => {
  try {
    const allRequests = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedRequests = await FriendRequest.find({
      recipient: req.user._id,
      status: "accepted",
    }).populate("sender", "fullName profilePic");

    return res.status(200).json({ allRequests, acceptedRequests });
  } catch (error) {
    console.log("Error in fetching requests controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getOutGoingRequests = async (req, res) => {
  try {
    const myRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    return res.status(200).json(myRequests);
  } catch (error) {
    console.log("Error in fetching my requests controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const request = await FriendRequest.findById(requestId);
    if (request.status === "accepted")
      return res
        .status(400)
        .json({ error: "You can't delete an already accepted request!" });

    await request.deleteOne();

    return res.status(200).json({ message: "Friend Request rejected!" });
  } catch (error) {
    console.log("Error in rejecting controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const removeAsFriend = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    if (friendId.toString() === req.user._id)
      return res.status(400).json({ error: "You can't unfriend yourself!" });
    if (!req.user.friends.find((id) => id.equals(friendId)))
      return res
        .status(400)
        .json({ error: "You aren't friends with this user!" });
    const unfriendThem = await User.findByIdAndUpdate(req.user._id, {
      $pull: { friends: friendId },
    });

    const unfriendMe = await User.findByIdAndUpdate(friendId, {
      $pull: { friends: req.user._id },
    });

    await FriendRequest.findOneAndDelete({
      $or: [
        { sender: req.user._id, recipient: friendId },
        { sender: friendId, recipient: req.user._id },
      ],
    });
    if (!unfriendThem || !unfriendMe)
      return res.status(400).json({ error: "Failed to unfriend!" });
    return res.status(201).json({ message: "Unfriended!" });
  } catch (error) {
    console.log("Error in unfriending controller", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
