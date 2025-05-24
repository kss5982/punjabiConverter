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

dictionRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id in router: ", id);
  const word = await Word.findById(id);
  console.log("word from id search: ", word);
  res.send(word);
});

dictionRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Word.findByIdAndDelete(id);
  res.status(200);
});

dictionRouter.post("/", async (req, res) => {
  console.log("request body:", req.body);
  let english = await req.body.phonetic.trim().toLowerCase().split(" ");
  console.log("english word(s):", english);
  const punjabi = await req.body.converted.trim();
  console.log("punjabi word(s):", punjabi);
  for (let i = 0; i < english.length; i++) {
    // punjabi.push(await req.body.converted);
    if (english[i] !== "" && punjabi !== "") {
      let searchWord = await Word.findOne({ phonetic: english[i] });
      // if you get a search result and it doesn't already have that punjabi conversion
      if (searchWord !== null && !searchWord.converted.includes(punjabi)) {
        searchWord = await Word.findOneAndUpdate(
          { phonetic: english[i] },
          { $push: { converted: punjabi } }
        );
        console.log(await Word.findOne({ phonetic: english[i] }));
      } else if (searchWord === null) {
        const addWord = new Word({
          phonetic: english[i],
          converted: punjabi,
        });
        await addWord
          .save()
          .then((data) => {
            console.log("IT WORKED!");
            console.log(data);
            // res.send(addWord);
          })
          .catch((err) => {
            console.log("ERROR");
            console.log(err);
          });
      }
    }
  }
  // // prevents page from refreshing after stuff is sent to database!
  res.status(204).send();
});

export default dictionRouter;
