import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  phonetic: {
    type: String,
  },
  converted: [String],
});

const Word = mongoose.model("Word", wordSchema);

export default Word;
