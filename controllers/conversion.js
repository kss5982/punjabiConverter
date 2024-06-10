import express, { json } from "express";
import "express-async-errors";
import Word from "../models/dictionaryWord.js";
import Fuse from "fuse.js";

const convertRouter = express.Router();

convertRouter.post("/", async (req, res) => {
  // console.log("in convertRouter", request.body);
  // converts payload into array of lowercase strings w/out spaces
  let phoneticTextArr = await req.body.payload
    .toLowerCase()
    .split(" ")
    .filter((word) => word !== "");

  // pings database using $in clause and ignores duplicates and phonetic text order
  // returns array of unique word objects
  let convertedArrayObj = await Word.aggregate().search({
    text: {
      query: phoneticTextArr,
      path: "phonetic",
      fuzzy: { maxEdits: 1, prefixLength: 1 },
    },
  });
  console.log(convertedArrayObj);

  let convertedArray = [];
  const options = {
    // Search in "phonetic" property
    keys: ["phonetic"],
    threshold: 0.3,
  };
  const fuse = new Fuse(convertedArrayObj, options);
  // iterates through original phonetic array and finds the correct conversion from returned array of objects
  for (const phoneticWord of phoneticTextArr) {
    let convertedWord = convertedArrayObj.find(
      (word) => word.phonetic === phoneticWord
    );
    console.log(convertedWord);
    // if exact value doesn't match from DB, perform second fuzzy search
    if (!convertedWord) {
      convertedWord = fuse.search(phoneticWord);
      console.log("2nd fuzzy search", convertedWord);
      convertedArray.push(convertedWord[0].item.converted[0]);
      console.log(convertedArray);
    }
    // console.log(convertedWord);
    // this is a substitute value at the moment must be altered.
    else {
      convertedArray.push(convertedWord.converted[0]);
    }
  }
  console.log(convertedArray);
  res.send(convertedArray.join(" "));
});

export default convertRouter;
