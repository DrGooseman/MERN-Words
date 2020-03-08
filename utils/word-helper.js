const { Word } = require("../models/wordlist");

function getWords(words, num) {
  let newArray = [];
  let count = 0;
  const now = new Date();

  words.forEach(word => {
    if (word.nextDate < now) {
      newArray.push(word);
      count++;
    }
    if (count == num) return newArray;
  });

  return newArray;
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

async function getExpandedWords(words)
{
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
      word.word = foundWord.word;
      word.definition = foundWord.definition;
    }
  });
  return newWords;
}

exports.getWords = getWords;
exports.getExpandedWords = getExpandedWords;
exports.changeWordLevel = changeWordLevel;
