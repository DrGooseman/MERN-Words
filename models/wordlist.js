const mongoose = require("mongoose");

const wordListSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  definition: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  }
});

const WordList = new mongoose.model("WordList", wordListSchema);

exports.WordList = WordList;
