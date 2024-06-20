import express, { json } from "express";
import "express-async-errors";
import Word from "../models/dictionaryWord.js";
import Fuse from "fuse.js";
import punctuation from "../utils/puntuation.js";

const convertRouter = express.Router();

convertRouter.post("/", async (req, res) => {
  // console.log("in convertRouter", request.body);
  // converts payload into array of lowercase strings w/out spaces
  let phoneticTextArr = await req.body.payload
    .trim()
    .toLowerCase()
    .split(/( |\n|\b)/)
    .filter((word) => word !== "" && word !== " ");

  console.log(phoneticTextArr);
  // pings database using $in clause and ignores duplicates and phonetic text order
  // returns array of unique word objects
  let convertedArrayObj = await Word.aggregate().search({
    text: {
      query: phoneticTextArr,
      path: "phonetic",
      fuzzy: { maxEdits: 1, prefixLength: 1 },
    },
  });
  // console.log(convertedArrayObj);

  // configures FuseJS fuzzy search
  const options = {
    keys: ["phonetic"],
    threshold: 0.3,
  };
  const fuse = new Fuse(convertedArrayObj, options);
  // iterates through original phonetic array and finds the correct conversion from returned array of objects
  let convertedArray = [];
  for (const phoneticWord of phoneticTextArr) {
    let convertedWord = convertedArrayObj.find(
      (word) => word.phonetic === phoneticWord
    );
    // console.log(convertedWord);
    // if exact value doesn't match from DB, perform second fuzzy search
    if (!convertedWord && !punctuation.includes(phoneticWord)) {
      convertedWord = fuse.search(phoneticWord);
      console.log("2nd fuzzy search", phoneticWord);
      // if 2nd fuzzy search has content, then append value
      if (convertedWord.length > 0) {
        convertedArray.push(convertedWord[0].item.converted[0]);
      }
      // if 2nd fuzzy search has nothing, then append phonetic value
      else {
        console.log(phoneticWord);
        convertedArray.push(phoneticWord);
      }
      // console.log(convertedArray);
    }
    // console.log(convertedWord);
    // appends converted value from exact match
    else if (convertedWord && convertedWord.converted[0]) {
      convertedArray.push(convertedWord.converted[0]);
    } else {
      convertedArray.push(phoneticWord);
    }
  }
  // console.log(convertedArray);
  let finalText = convertedArray.join(" ");
  console.log("before regex", finalText);
  finalText = finalText
    .replace(/\s(?=!|\?|\.|,|\)|\]|\}|@|%|\^|\*|\+|_|`|~|\/|\\)/g, "")
    .replace(/(?<=\(|\{|\[|#|\$)\s/g, "")
    .replace(/" *([^"]*?) *"/g, '"$1"')
    .replace(/' *([^']*?) *'/g, "'$1'");
  // .replace(/["|'](\s).*?(\s)["|']/g, "");
  // .replace(/(?<="|')\s(?!"|')/g, "");
  // .replace(/(?<!"|')\s(?="|')/g, "");
  // function removeSpaceBtwnQuotes(input) {
  //   return input.replace(/("|')[^"|']+("|')/g, (match) =>
  //     match.replace(/\s/g, "")
  //   );
  // }
  // finalText = removeSpaceBtwnQuotes(finalText);
  console.log("after regex", finalText);
  const finalObject = {
    converted: finalText,
  };
  res.send(finalObject);
});

export default convertRouter;
