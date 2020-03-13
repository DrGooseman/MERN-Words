const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const { User, validate } = require("../models/user");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const {
  getWords,
  getExpandedWords,
  changeWordLevel,
  getWordInfo,
  getPopulatedWordsNewUser,
  populateNewWordsIfNeeded
} = require("../utils/word-helper");

router.post("/login", async (req, res) => {
  let user;

  try {
    user = await User.findOne({ email: req.body.email });
  } catch (err) {
    return res.status(500).send({ message: "Login failed, try again later." });
  }

  if (!user) return res.status(404).send({ message: "User not found." });

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(req.body.password, user.password);
  } catch (err) {
    return res.status(500).send({ message: "Login failed, try again later." });
  }

  if (!isValidPassword)
    return res.status(403).send({ message: "Email or password is incorrect." });

  if (populateNewWordsIfNeeded(user.allLangs["words" + user.lang], user.lang)) {
    try {
      await user.save();
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Server error, could not update the user." });
    }
  }

  const token = user.generateAuthToken();

  res.json({
    _id: user._id,
    email: user.email,
    name: user.name,
    token,
    lang: user.lang
  });
  // console.log(_.pick(user, ["_id", "name", "email"]));
  //  res
  //  .header("x-auth_token", token)
  // .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/lang", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).send({ message: "User not found." });

  user.lang = req.body.lang;

  //verifyHasLang(user);

  populateNewWordsIfNeeded(user.allLangs["words" + user.lang], user.lang);

  try {
    await user.save();
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Server error, could not update the user." });
  }

  const token = user.generateAuthToken();

  res.json({
    _id: user._id,
    email: user.email,
    name: user.name,
    token,
    lang: user.lang
  });
  // console.log(_.pick(user, ["_id", "name", "email"]));
  //  res
  //  .header("x-auth_token", token)
  // .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: "Invalid inputs." });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ message: "Email already in use." });

  user = new User(_.pick(req.body, ["name", "email", "password", "lang"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user.allLangs["words" + req.body.lang] = getPopulatedWordsNewUser(
    req.body.lang
  );

  await user.save();

  const token = user.generateAuthToken();
  res.json({
    _id: user._id,
    email: user.email,
    name: user.name,
    token,
    lang: user.lang
  });
  //res
  // .header("x-auth_token", token)
  // .send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/words/info", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  const wordInfo = {
    readyToLearn: 0,
    readyToReview: 0,
    learned: 0,
    mastered: 0,
    words: 0
  };

  user.allLangs["words" + user.lang].forEach(word => {
    wordInfo.words++;
    if (word.level === 4) wordInfo.mastered++;
    else if (word.level > 0) wordInfo.learned++;
    if (new Date(word.nextDate) < new Date()) {
      if (word.level > 0) wordInfo.readyToReview++;
      else wordInfo.readyToLearn++;
    }
  });
  res.send({ wordInfo: wordInfo });
});

router.get("/words/:numOfWords&:category", auth, async (req, res) => {
  const user = await User.findById(req.user._id); //.select("-password");
  const lang = user.lang;

  let words = getWords(
    user.allLangs["words" + lang],
    Number(req.params.numOfWords),
    req.params.category,
    lang
  );

  //words = await getExpandedWordsLight(words);
  res.send({ words });
});

router.get("/words", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const lang = user.lang;
  const words = user.allLangs["words" + lang];

  const wordsAmount = words.length;

  const expandedWords = await getExpandedWords(words, lang);

  if (words.length > wordsAmount) {
    try {
      await user.save();
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Server error, could not update the user." });
    }
  }

  res.send({ words: expandedWords });
});

router.get("/words/info/:wordNum", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const lang = user.lang;
  const words = user.allLangs["words" + lang];

  const wordInfo = await getWordInfo(words, Number(req.params.wordNum), lang);

  res.send({ word: wordInfo });
});

router.patch("/words/:wordNum", auth, async (req, res) => {
  const wordNum = Number(req.params.wordNum);
  const user = await User.findById(req.user._id);
  const lang = user.lang;
  const words = user.allLangs["words" + lang];
  const level = req.body.level || 0;
 const isFlagged = req.body.isFlagged || false;
 
  let word = words.find(word => word.number === wordNum);

  if (!word) {
    word = { number: wordNum, level: 0, nextDate: new Date(), isFlagged:isFlagged };
	if (level > 0)
    changeWordLevel(word, level);
    words.push(word);
  } else {
	  if(req.body.level !== undefined)
	  changeWordLevel(word, level);
		 if(req.body.isFlagged !== undefined)
	  word.isFlagged = req.body.isFlagged;

  }

  try {
    await user.save();
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Server error, could not save the word." });
  }

  res.send({ word });
});

module.exports = router;
