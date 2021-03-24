import express from "express";
import feed from "./routes/feed";
import mongoose from "mongoose";
import path from "path";
require("dotenv").config();

const app = express();
app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use('images', )

app.use("/feed", feed);
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
