import express from "express";
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
  // sends ~100 words max to database at a time from total phonetic words
  for (let i = 0; i <= Math.floor(phoneticTextArr.length / 100); i++) {
    // pings database and returns a large array of objects
    fuzzySearch = await Word.aggregate().search({
      text: {
        query: copyOfPhoneticArray.splice(0, 100),
        path: "phonetic",
        fuzzy: { maxEdits: 1, prefixLength: 1 },
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
  // convertedArray will be used in REGEX (first value of dropdown)
  let convertedArray = [];
  let finalDropDownMenu = [];
  for (const phoneticWord of phoneticTextArr) {
    // let convertedWord = convertedArrayObj
    //   .flat(1)
    //   .find((word) => word.phonetic === phoneticWord);
    // console.log(convertedWord);
    // console.log(convertedArrayObj);
    // if exact value doesn't match from DB, perform second fuzzy search
    if (!punctuation.includes(phoneticWord)) {
      let convertedWord = fuse.search(phoneticWord);
      // console.log("2nd fuzzy search", phoneticWord);
      // check if 2nd fuzzy search has content
      if (convertedWord.length > 0) {
        //convertedWord[0].item.converted[0] is the array of coverted values
        convertedArray.push(convertedWord[0].item.converted[0]);
        // console.log("converted array: ", convertedArray);

        // creates an array with the best fuzzy match converted values + phonetic word
        let dropDownValues = [];
        // checks if converted word has more than 1 possible value
        if (convertedWord[0].item.converted.length > 1) {
          // if it does, then add 2nd possible value and onwards into dropdown menu (don't need first)
          dropDownValues = Array.from(convertedWord[0].item.converted.slice(1));
        }
        dropDownValues.push(phoneticWord);
        // console.log(dropDownValues);
        finalDropDownMenu.push(dropDownValues);
      }
      // if 2nd fuzzy search has nothing, then append phonetic value
      else {
        // console.log(phoneticWord);
        // add unidentified word to dropdowns if its actually an alphanumeric value (not punctuation/symbols)
        if (/^[a-zA-Z0-9]+$/.test(phoneticWord)) {
          finalDropDownMenu.push([phoneticWord]);
        }
        convertedArray.push(phoneticWord);
      }
      // console.log(convertedArray);
      // adds punctuation back into the array
    } else convertedArray.push(phoneticWord);
    // console.log(convertedWord);
  }
  // console.log("converted array: ", convertedArray);
  // console.log(finalDropDownMenu);
  let finalText = convertedArray.join(" ");
  // console.log("before regex", finalText);
  finalText = finalText
    .replace(/\s(?=!|\?|\.|:|,|\)|\]|\}|@|%|\^|\*|\+|_|~|\/|\\|l|I|\|)/g, "") // removes space before character
    .replace(/(?<=\(|\{|\[|#|\$|'|`|_|\n)\s/g, "") // removes space after character
    .replace(/" *([^"]*?) *"/g, '"$1"'); // removes spaces between quotes

  const finalObject = {
    // converted: finalText,
    splitFinal: finalText.split(" "),
    dropdowns: finalDropDownMenu,
  };
  res.send(finalObject);
});

export default convertRouter;
