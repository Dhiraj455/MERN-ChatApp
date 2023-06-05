const Chat = require("../models/chat");
const User = require("../models/user");

module.exports.accessChat = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { userId } = req.body;
    if (!userId) {
      response.message = "User id is required";
      return res.status(400).json(response);
    }
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "-password",
    });

    if (isChat.length > 0) {
      response.success = true;
      response.message = "Chat found";
      response.chat = isChat[0];
      return res.status(200).json(response);
    }

    const newChat = await Chat.create({
      chatName: "sender1",
      users: [req.user._id, userId],
      isGroupChat: false,
    });

    const FullChat = await Chat.findOne({
      _id: newChat._id,
    }).populate("users", "-password");

    response.success = true;
    response.message = "Chat created";
    response.chat = FullChat;
    return res.status(200).json(response);
  } catch (err) {
    response.errMessage = "Something went wrong";
    res.status(400).json(response);
  }
};

module.exports.getChats = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
    data: [],
  };
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "-password",
        });
        if (!result || result.length === 0) {
          response.errMessage = "No chats found";
          return res.status(400).json(response);
        }
        response.success = true;
        response.message = "Chats found";
        response.data = result;
        return res.status(200).json(response);
      });
  } catch (err) {
    response.errMessage = "Something went wrong";
    res.status(400).json(response);
  }
};
