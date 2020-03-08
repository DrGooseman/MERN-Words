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

exports.getWords;
