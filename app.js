import configuration from "./utils/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);

mongoose
  .connect(configuration.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.post("/", (request, response) => {
  try {
    response.send(request.body);
  } catch (err) {
    console.log(err);
  }

  // return await request.body.config.data;
});

export default app;
