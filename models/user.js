const jwt = require("jsonwebtoken");
//const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  words: [
    {
      number: { type: Number, ref: "Word" },
      level: Number,
      nextDate: Date
    }
  ]
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY,  { expiresIn: "12h" });
  return token;
};

const User = new mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

function populateWords() {
  let words = [];
  const date = new Date();
  for (let i = 0; i < 1000; i++) {
    words.push({ number: i, level: 0, nextDate: date });
  }

  return words;
}

exports.User = User;
exports.validate = validateUser;
exports.populateWords = populateWords;
