const User = require("../models/user");
const generateToken = require("../config/generateToken");

module.exports.register = async (req, res) => {
  const response = {
    success: false,
    message: "",
    errMessage: "",
  };
  const { name, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !email || !password) {
    return res.status(422).json({ message: "Please fill all the fields" });
  }
  if (!emailRegex.test(email)) {
    return res.status(422).json({ message: "Enter a valid email" });
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
    response.errMessage = "Something went wrong";
    res.status(400).json(response);
  }
};

module.exports.login = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    const isMatch = await user.matchPassword(password);
    if (!user || !isMatch) {
      return res.json({ message: "Invalid credentials" }).status(200);
    }
    const token = generateToken(user._id);
    console.log(token);
    response.success = true;
    response.message = "User logged in successfully";
    response.token = token;
    response.user = user;
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    response.errMessage = "Something went wrong";
    res.status(400).json(response);
  }
};
