import express, { json } from "express";
import "express-async-errors";
import Word from "../models/dictionaryWord.js";

const dictionRouter = express.Router();

dictionRouter.get("/", async (req, res) => {
  let allWords = await Word.find({});
  Array.prototype.sortBy = function (p) {
    return this.slice(0).sort(function (a, b) {
      return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0;
    });
  };
  allWords = allWords.sortBy("phonetic");
  res.send(allWords);
});

export default dictionRouter;
