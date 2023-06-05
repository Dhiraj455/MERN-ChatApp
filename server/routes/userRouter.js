const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { upload, setDestination } = require("../middleware/image");
const Auth = require("../middleware/authMiddleware");

router.post(
  "/register",
  setDestination("public/images/UserPic"),
  upload.single("pic"),
  userController.register
);

router.post("/login", userController.login);

router.get("/getUsers", Auth, userController.getUsers);

module.exports = router;
