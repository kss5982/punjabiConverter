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

  // let convertedArrayObj = [];
  // for (const phoneticWord of phoneticTextArr) {
  //   let convertedWord = await Word.findOne({
  //     phonetic: phoneticWord,
  //   });
  //   convertedArrayObj.push(convertedWord);
  // }

  let convertedArrayObj = [];
  // pings database using $in clause and ignores duplicates and phonetic text order
  // returns array of unique word objects
  convertedArrayObj = await Word.find({ phonetic: { $in: phoneticTextArr } });
  // console.log("in convertRouter", convertedArrayObj);
  // let convertedArray = convertedArrayObj
  //   .map((obj) => obj.converted[0])
  //   .join(" ");

  let convertedArray = [];
  let convertedWord;
  // iterates through original phonetic array and finds the correct conversion from returned array of objects
  for (const phoneticWord of phoneticTextArr) {
    convertedWord = convertedArrayObj.find(
      (word) => word.phonetic === phoneticWord
    );
    // console.log(convertedWord);
    // this is a substitute value at the moment must be altered.
    convertedArray.push(convertedWord.converted[0]);
  }
  console.log(convertedArray);
  res.send(convertedArray.join(" "));
});

export default convertRouter;
