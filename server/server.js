const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const initRoute = require("./routes/initRouter");
const multer = require("multer");
const path = require("path");
require("./config/db");

dotenv.config();

app.use(express.json());
app.use(cors());

const upload = multer({
  destination: "public/images",
});
app.use(express.static(path.join(__dirname, "public")));

initRoute(app);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));
