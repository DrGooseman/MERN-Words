const { Word } = require("../models/wordlist");
const { wordsArray, translationsArray } = require("./word-list");

function getWords(words, num) {
  let newArray = [];
  let count = 0;
  const now = new Date();

  for (let i = 0; i < words.length; i++) {
    if (new Date(words[i].nextDate) < now) {
      newArray.push(words[i]);
      count++;
    }
    if (count > num) return newArray;
  }
}

function changeWordLevel(word, level) {
  word.level = level;
  if (level == 0) word.nextDate = new Date();
  else if (level == 1)
    word.nextDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 2);
  else if (level == 2)
    word.nextDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 48);
  else if (level == 3)
    word.nextDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
  else if (level == 4)
    word.nextDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 21);
}

async function getExpandedWords(words) {
  const newWords = [];
  const wordList = await Word.find();

  words.forEach(word => {
    const foundWord = wordList.find(lWord => lWord.number == word.number);

    if (foundWord) {
      newWords.push({
        number: word.number,
        level: word.level,
        nextDate: word.nextDate,
        word: foundWord.word,
        definition: foundWord.definition
      });
    }
  });
  return newWords;
}

async function getExpandedWordsLight(words) {
  const newWords = [];
  const wordList = await Word.find();

  words.forEach(word => {
    const foundWord = wordList.find(lWord => lWord.number == word.number);

    if (foundWord) {
      const { sentence, translatedSentence } = findSentence(foundWord.word);
      newWords.push({
        number: word.number,
        level: word.level,
        word: foundWord.word,
        definition: foundWord.definition,
        sentence: sentence,
        translatedSentence: translatedSentence
      });
    }
  });
  return newWords;
}

function findSentence(word) {
  for (let i = 0; i < wordsArray.length; i++) {
    if (wordsArray[i].search(new RegExp(` ${word}[ !.,]`,"i")) > -1)
      return {
        sentence: wordsArray[i],
        translatedSentence: translationsArray[i]
      };
  }
  return { sentence: undefined, translatedSentence: undefined };
}

exports.getWords = getWords;
exports.getExpandedWords = getExpandedWords;
exports.changeWordLevel = changeWordLevel;
exports.getExpandedWordsLight = getExpandedWordsLight;
