import configuration from "./utils/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import convertRouter from "./controllers/conversion.js";
import dictionRouter from "./controllers/dictionary.js";
import usersRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

mongoose.set("strictQuery", false);

mongoose
  .connect(configuration.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false, // This disables the CSP header
  })
);
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("dist"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", convertRouter);
app.use("/api/dictionary", dictionRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

//lets server render React code on refresh
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

export default app;
