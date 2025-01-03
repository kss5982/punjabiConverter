import express, { json } from "express";
import "express-async-errors";
import Word from "../models/dictionaryWord.js";
import Fuse from "fuse.js";
import punctuation from "../utils/puntuation.js";

const convertRouter = express.Router();

convertRouter.post("/", async (req, res) => {
  // console.log("in convertRouter", request.body);
  // converts payload into array of lowercase strings w/out spaces
  const phoneticTextArr = await req.body.payload
    .trim()
    .split(/( |\n|[_]|\b)/)
    .filter((word) => word !== "" && word !== " ");

  // console.log(phoneticTextArr);
  let copyOfPhoneticArray = phoneticTextArr.slice();
  let convertedArrayObj = [];
  let fuzzySearch = [];
  // console.log("Array length: ", phoneticTextArr.length);
  // console.log(
  //   "Projected iterations: ",
  //   Math.floor(phoneticTextArr.length / 100)
  // );
  for (let i = 0; i <= Math.floor(phoneticTextArr.length / 100); i++) {
    // console.log("iteration value: ", i);
    // if (i === Math.floor(phoneticTextArr.length / 100)) {
    //   console.log("final loop!");
    // }
    // pings database using $in clause and ignores duplicates and phonetic text order
    // returns array of unique word objects
    fuzzySearch = await Word.aggregate().search({
      text: {
        query: copyOfPhoneticArray.splice(0, 100),
        path: "phonetic",
        fuzzy: { maxEdits: 1, prefixLength: 3 },
      },
    });
    convertedArrayObj.push(fuzzySearch);
    // console.log(convertedArrayObj);
  }

  // configures FuseJS fuzzy search
  const options = {
    keys: ["phonetic"],
    threshold: 0.3,
  };
  const fuse = new Fuse(convertedArrayObj.flat(1), options);
  // iterates through original phonetic array and finds the correct conversion from returned array of objects
  let convertedArray = [];
  let finalObjectList = [];
  for (const phoneticWord of phoneticTextArr) {
    let convertedWord = convertedArrayObj.find(
      (word) => word.phonetic === phoneticWord
    );
    // console.log(convertedWord);
    // if exact value doesn't match from DB, perform second fuzzy search
    if (!convertedWord && !punctuation.includes(phoneticWord)) {
      convertedWord = fuse.search(phoneticWord);
      // console.log("2nd fuzzy search", phoneticWord);
      // check if 2nd fuzzy search has content
      if (convertedWord.length > 0) {
        convertedArray.push(convertedWord[0].item.converted[0]);
        //adds non-duplicate object into array as part of response (dropdown)
        if (
          !finalObjectList.some(
            (word) => word.item.phonetic === convertedWord[0].item.phonetic
          )
        ) {
          finalObjectList.push(convertedWord[0]);
        }
      }
      // if 2nd fuzzy search has nothing, then append phonetic value
      else {
        // console.log(phoneticWord);
        convertedArray.push(phoneticWord);
      }
      // console.log(convertedArray);
      // adds punctuation back into the array
    } else convertedArray.push(phoneticWord);
    // console.log(convertedWord);
  }
  // console.log(convertedArray);
  // console.log(finalObjectList);
  let finalText = convertedArray.join(" ");
  console.log("before regex", finalText);
  finalText = finalText
    .replace(/\s(?=!|\?|\.|,|\)|\]|\}|@|%|\^|\*|\+|_|~|\/|\\|l|I|\|)/g, "") //removes space before character
    .replace(/(?<=\(|\{|\[|#|\$|'|`|_)\s/g, "") //removes space after character
    .replace(/" *([^"]*?) *"/g, '"$1"'); //removes spaces between quotes

  const finalObject = {
    converted: finalText,
    dropdown: finalObjectList,
  };
  res.send(finalObject);
});

export default convertRouter;
