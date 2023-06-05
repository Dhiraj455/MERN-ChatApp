const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const Auth = require('../middleware/authMiddleware');

router.post('/', Auth, chatController.accessChat);

router.get("/", Auth, chatController.getChats);

router.post("/group", Auth, chatController.createGroup);

router.put("/rename", Auth, chatController.renameGroup);

// router.put("/add", Auth, chatController.addMember);

// router.put("/remove", Auth, chatController.removeMember);

module.exports = router;