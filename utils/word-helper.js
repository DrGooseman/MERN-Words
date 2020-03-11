//const { Word } = require("../models/wordlist");
const { wordsArray,sentencesArray, translationsArray, wordsTop1000Array, wordsFoodArray, wordsUsefulArray, wordsCurseArray } = require("./word-list");

function getWords(words, num, category) {
  let newArray = [];
  let count = 0;
  const now = new Date();
  let array = wordsTop1000Array;
 
  if (category === "Food")
	  array = wordsFoodArray;
  else if (category === "Useful")
	  array = wordsUsefulArray;
  else if (category === "Curse")
	  array = wordsCurseArray;

  
  for (let i = 0; i < array.length; i++) {
	  
	  const wordNum = array[i].number;
	  const userWord = words.find((word)=>word.number === wordNum);
	  
	  
	  if (!userWord){
		    const { sentence, translatedSentence } = findSentence(array[i].word);
		   newArray.push({
        number: wordNum,
        level: 0,
        word: array[i].word,
        definition: array[i].definition,
        sentence: sentence,
		   translatedSentence: translatedSentence}
      );
			count++;
	  }
    else if (new Date(userWord.nextDate) < now) {
		  const { sentence, translatedSentence } = findSentence(array[i].word);
      newArray.push({
        number: userWord.number,
        level: userWord.level,
        word: array[i].word,
        definition: array[i].definition,
        sentence: sentence,
        translatedSentence: translatedSentence
      });
      count++;
    }
    if (count > num) return newArray;
  }
  
  //Not enough words ready for review? Run again, but take any words (as long as they werent taken last time)
  
   for (let i = 0; i < array.length; i++) {
	  
	  const wordNum = array[i].number;
	  const userWord = words.find((word)=>word.number === wordNum);
	  
	 if (userWord && !newArray.some((word)=> word.number === array[i].number)) {
		  const { sentence, translatedSentence } = findSentence(array[i].word);
      newArray.push({
        number: userWord.number,
        level: userWord.level,
        word: array[i].word,
        definition: array[i].definition,
        sentence: sentence,
        translatedSentence: translatedSentence
      });
      count++;
    }
    if (count > num) return newArray;
  }
}

function getWordInfo(userWords, wordNum){
	const userWord = userWords.find((word)=>word.number === wordNum);
	const word = wordsArray.find((word)=>word.number === wordNum);
	
	return { 
	number: word.number,
	word: word.word,
	definition: word.definition,
	level: userWord.level,
	nextDate: userWord.nextDate,
	sentences: findAllSentences(word.word)
	};
}



function changeWordLevel(word, level) {
  word.level = level;
  if (level == 0) word.nextDate = new Date();
  else if (level == 1)
    word.nextDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 4);
  else if (level == 2)
    word.nextDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2);
  else if (level == 3)
    word.nextDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
  else if (level == 4)
    word.nextDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 21);
}

async function getExpandedWords(words) {
  const newWords = [];
  const wordList = wordsArray;//await Word.find();
  
  wordList.forEach(word => {
    let foundUserWord = words.find(uWord => uWord.number == word.number);
	
	if (!foundUserWord){
		foundUserWord = {number: word.number, level: 0, nextDate: new Date()};
		words.push(foundUserWord);
	}


      newWords.push({
        number: foundUserWord.number,
        level: foundUserWord.level,
        nextDate: foundUserWord.nextDate,
        word: word.word,
        definition: word.definition,
		categories: word.categories
      });
  
  });
  
  return newWords;
}

function findSentence(word) {
  for (let i = 0; i < sentencesArray.length; i++) {
    if (sentencesArray[i].search(new RegExp(` ${word}[ !.,]`,"i")) > -1)
      return {
        sentence: sentencesArray[i],
        translatedSentence: translationsArray[i]
      };
  }
  return { sentence: undefined, translatedSentence: undefined };
}

function findAllSentences(word) {
	const foundSentences = [];
  for (let i = 0; i < sentencesArray.length; i++) {
    if (sentencesArray[i].search(new RegExp(` ${word}[ !.,]`,"i")) > -1)
      foundSentences.push( {
        sentence: sentencesArray[i],
        translatedSentence: translationsArray[i]
      });
  }
  return foundSentences;
}

exports.getWords = getWords;
exports.getExpandedWords = getExpandedWords;
exports.changeWordLevel = changeWordLevel;
exports.getWordInfo = getWordInfo;
