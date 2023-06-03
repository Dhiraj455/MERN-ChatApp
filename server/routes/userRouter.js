const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { upload, setDestination } = require("../middleware/image");

router.post(
  "/register",
  setDestination("public/images/UserPic"),
  upload.single("pic"),
  userController.register
);

module.exports = router;
