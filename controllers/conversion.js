import express, { json } from "express";
import "express-async-errors";
import Word from "../models/dictionaryWord.js";

const convertRouter = express.Router();

convertRouter.post("/", async (request, response) => {
  //   console.log("in convertRouter", request.body);
  response.send(request.body);
});

export default convertRouter;
