const mongoose = require("mongoose");

const wordsSchema = new mongoose.Schema({
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
    required: true,
    ref: "User"
  }
});

const Word = new mongoose.model("Word", wordsSchema);

exports.Word = Word;
