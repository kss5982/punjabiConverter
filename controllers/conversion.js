import express from "express";
import "express-async-errors";
import Word from "../models/dictionaryWord.js";
import Fuse from "fuse.js";
import punctuation from "../utils/puntuation.js";
import { emojiPattern, compactEmojiPattern } from "regex-combined-emojis";

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
    shouldSort: true,
    keys: ["phonetic"],
    threshold: 0.4,
  };
  const fuse = new Fuse(convertedArrayObj.flat(1), options);
  // console.log(fuse);
  // iterates through original phonetic array and finds the correct conversion from returned array of objects
  // finalArray will be used in REGEX (first value of dropdown)
  let finalArray = [];
  let finalDropDownMenu = [];
  for (const phoneticWord of phoneticTextArr) {
    let exactExists;
    let initialSearch = convertedArrayObj
      .flat(1)
      .find((word) => word.phonetic === phoneticWord);
    // console.log("converted word object:", initialSearch);
    if (initialSearch) {
      exactExists = true;
    }
    // creates an array with the best fuzzy match converted values + phonetic word
    let dropDownValues = [];
    if (exactExists && !punctuation.includes(phoneticWord)) {
      console.log(`exact match! ${phoneticWord} exists in dictionary`);
      finalArray.push(initialSearch.converted[0]);
      // checks if converted word has more than 1 possible value
      if (initialSearch.converted.length > 1) {
        // if it does, then add 2nd possible value and onwards into dropdown menu (don't need first)
        dropDownValues = Array.from(initialSearch.converted.slice(1));
        console.log(dropDownValues);
      }
      dropDownValues.push(phoneticWord);
      // console.log(dropDownValues);
      finalDropDownMenu.push(dropDownValues);
    }
    // console.log( convertedArrayObj);
    // if exact value doesn't match from DB, perform second fuzzy search
    else if (!punctuation.includes(phoneticWord)) {
      let fuseWord = fuse.search(phoneticWord);
      // console.log("fuse word", fuseWord);
      // console.log("2nd fuzzy search", phoneticWord);
      // check if 2nd fuzzy search has content
      if (fuseWord.length > 0) {
        //fuseWord[0].item.converted[0] is the array of coverted values
        finalArray.push(fuseWord[0].item.converted[0]);
        // console.log("final array: ", finalArray);

        // checks if converted word has more than 1 possible value
        if (fuseWord[0].item.converted.length > 1) {
          // if it does, then add 2nd possible value and onwards into dropdown menu (don't need first)
          dropDownValues = Array.from(fuseWord[0].item.converted.slice(1));
          console.log(dropDownValues);
        }
        // add additional non-duplicate dropdown suggestions
        if (
          fuseWord.length > 1 &&
          !fuseWord[1].item.converted.includes(fuseWord[0].item.converted[0])
        ) {
          dropDownValues.push(...fuseWord[1].item.converted);
          console.log("dropdown values", dropDownValues);
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
        } else if (new RegExp(emojiPattern, "g").test(phoneticWord)) {
          finalDropDownMenu.push([phoneticWord]);
        }
        finalArray.push(phoneticWord);
      }
      // console.log(finalArray);
      // adds punctuation back into the array
    } else finalArray.push(phoneticWord);
    // console.log(fuseWord);
  }
  // console.log("converted array: ", finalArray);
  // console.log(finalDropDownMenu);
  let finalText = finalArray.join(" ");
  // console.log("before regex", finalText);
  finalText = finalText
    .replace(/\s(?=!|\?|\.|:|,|\)|\]|\}|@|%|\^|\*|\+|_|~|\/|\\|\|)/g, "") // removes space before character
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
