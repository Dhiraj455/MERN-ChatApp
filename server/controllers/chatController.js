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
      chatName: "sender",
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

module.exports.createGroup = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { users, groupName } = req.body;
    if (!users || users.length === 0 || !groupName) {
      response.message = "Users and group name are required";
      return res.status(400).json(response);
    }

    let user = JSON.stringify(users);
    user = JSON.parse(user);

    if (user.length < 2) {
      response.message = "Please select more than one user";
      return res.status(400).json(response);
    }
    user.push(req.user);

    const groupChat = await Chat.create({
      chatName: groupName,
      users: user,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const FullChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    response.success = true;
    response.message = "Group created";
    response.chat = FullChat;
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    response.errMessage = "Something went wrong";
    res.status(400).json(response);
  }
};

module.exports.renameGroup = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
      response.message = "Chat id and chat name are required";
      return res.status(400).json(response);
    }
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, groupAdmin: req.user._id },
      { chatName: chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!chat) {
      response.message = "Chat not found";
      return res.status(400).json(response);
    }
    response.success = true;
    response.message = "Chat renamed";
    response.chat = chat;
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    response.errMessage = "Something went wrong";
    res.status(400).json(response);
  }
};

module.exports.addMember = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      response.errMessage = "Chat id and user id are required";
      return res.status(400).json(response);
    }

    const memberExist = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    });

    if (memberExist) {
      response.errMessage = "Member already exist";
      return res.status(400).json(response);
    }

    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        groupAdmin: req.user._id,
      },
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!chat) {
      response.errMessage = "Chat not found";
      return res.status(400).json(response);
    }

    response.success = true;
    response.message = "Member added";
    response.chat = chat;
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    response.errMessage = "Something went wrong";
    res.status(400).json(response);
  }
};

module.exports.removeMember = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      response.errMessage = "Chat id and user id are required";
      return res.status(400).json(response);
    }

    const memberNotExist = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    });

    if (!memberNotExist) {
      response.errMessage = "Member not exist";
      return res.status(400).json(response);
    }

    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        groupAdmin: req.user._id,
      },
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!chat) {
        response.errMessage = "Chat not found";
        return res.status(400).json(response);
    }

    response.success = true;
    response.message = "Member removed";
    response.chat = chat;
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    response.errMessage = "Something went wrong";
    res.status(400).json(response);
  }
};
