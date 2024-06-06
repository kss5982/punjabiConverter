import express, { json } from "express";
import "express-async-errors";
import Word from "../models/dictionaryWord.js";

const convertRouter = express.Router();

convertRouter.post("/", async (req, res) => {
  // console.log("in convertRouter", request.body);

  // converts payload into array of lowercase strings w/out spaces
  let phoneticTextArr = await req.body.payload
    .toLowerCase()
    .split(" ")
    .filter((word) => word !== "");

  let convertedArrayObj = [];
  // for (const phoneticWord of phoneticTextArr) {
  //   let convertedWord = await Word.findOne({
  //     phonetic: phoneticWord,
  //   });
  //   convertedArrayObj.push(convertedWord);
  // }

  convertedArrayObj = await Word.find({ phonetic: { $in: phoneticTextArr } });
  // console.log("in convertRouter", convertedArrayObj);
  // let convertedArray = convertedArrayObj
  //   .map((obj) => obj.converted[0])
  //   .join(" ");

  let convertedArray = [];
  let convertedWord;
  for (const phoneticWord of phoneticTextArr) {
    convertedWord = convertedArrayObj.find(
      (word) => word.phonetic === phoneticWord
    );
    console.log(convertedWord);
    convertedArray.push(convertedWord.converted[0]);
  }
  console.log(convertedArray);
  res.send(convertedArray.join(" "));
});

export default convertRouter;
