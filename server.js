const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes

app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api/shortdist", require("./routes/distance"));

//  Connect to mongodb

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
