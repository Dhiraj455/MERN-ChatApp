const User = require("../models/user");
const generateToken = require("../config/generateToken");

module.exports.register = async (req, res) => {
  const response = {
    success: true,
    message: "",
    errMessage: "",
  };
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ message: "Please fill all the fields" });
  }
  try {
    let image;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.json({ message: "User already exists" }).status(200);
    }
    if (req.file) {
      temp = req.file.filename.split(".");
      fileType = temp[temp.length - 1];
      image = process.env.URL + "/images/UserPic/" + req.file.filename;
    }
    const newUser = new User({
      name,
      email,
      password,
      pic: image,
    });
    await newUser.save();
    response.success = true;
    response.message = "User created successfully";
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
  }
};
