var Excel = require("exceljs");

var wb = new Excel.Workbook();
var path = require("path");
var wordsFilePath = path.resolve(__dirname, "../wordlist.xlsx");
var sentencesFilePath = path.resolve(__dirname, "../sentencelist.xlsx");

const wordsArrayDE = [];

const sentencesArrayDE = [];
const translationsArrayDE = [];

const wordsTop1000ArrayDE = [];
const wordsFoodArrayDE = [];
const wordsUsefulArrayDE = [];
const wordsCurseArrayDE = [];

const wordsArrayRU = [];

const sentencesArrayRU = [];
const translationsArrayRU = [];

const wordsTop1000ArrayRU = [];
const wordsFoodArrayRU = [];
const wordsUsefulArrayRU = [];
const wordsCurseArrayRU = [];

wb.xlsx.readFile(sentencesFilePath).then(function() {
  var sh = wb.getWorksheet("German");

  for (i = 1; i <= sh.rowCount; i++) {
    sentencesArrayDE.push(sh.getRow(i).getCell(1).value);
    translationsArrayDE.push(sh.getRow(i).getCell(2).value);
  }
  
   sh = wb.getWorksheet("Russian");

  for (i = 1; i <= sh.rowCount; i++) {
    sentencesArrayRU.push(sh.getRow(i).getCell(1).value);
    translationsArrayRU.push(sh.getRow(i).getCell(2).value);
  }
});

wb.xlsx.readFile(wordsFilePath).then(function() {
  var sh = wb.getWorksheet("German");

  for (i = 1; i <= sh.rowCount; i++) {
    wordsArrayDE.push({
      number: sh.getRow(i).getCell(1).value,
      word: sh.getRow(i).getCell(2).value,
      definition: sh.getRow(i).getCell(3).value,
      categories: sh.getRow(i).getCell(4).value || " "
    });
  }

  for (let i = 0; i < 1000; i++) wordsTop1000ArrayDE.push(wordsArrayDE[i]);

  for (let i = 0; i < wordsArrayDE.length; i++) {
    if (wordsArrayDE[i].categories.includes("Food"))
      wordsFoodArrayDE.push(wordsArrayDE[i]);

    if (wordsArrayDE[i].categories.includes("Useful"))
      wordsUsefulArrayDE.push(wordsArrayDE[i]);

    if (wordsArrayDE[i].categories.includes("Curse"))
      wordsCurseArrayDE.push(wordsArrayDE[i]);
  }
  
    sh = wb.getWorksheet("Russian");

  for (i = 1; i <= sh.rowCount; i++) {
    wordsArrayRU.push({
      number: sh.getRow(i).getCell(1).value,
      word: sh.getRow(i).getCell(2).value,
      definition: sh.getRow(i).getCell(3).value,
      categories: sh.getRow(i).getCell(4).value || " "
    });
  }

  for (let i = 0; i < 1000; i++) wordsTop1000ArrayRU.push(wordsArrayRU[i]);

  for (let i = 0; i < wordsArrayRU.length; i++) {
    if (wordsArrayRU[i].categories.includes("Food"))
      wordsFoodArrayRU.push(wordsArrayRU[i]);

    if (wordsArrayRU[i].categories.includes("Useful"))
      wordsUsefulArrayRU.push(wordsArrayRU[i]);

    if (wordsArrayRU[i].categories.includes("Curse"))
      wordsCurseArrayRU.push(wordsArrayRU[i]);
  }
  
});

const allLangs = {
  DE: {
    wordsArray: wordsArrayDE,
    wordsTop1000Array: wordsTop1000ArrayDE,
    wordsFoodArray: wordsFoodArrayDE,
    wordsUsefulArray: wordsUsefulArrayDE,
    wordsCurseArray: wordsCurseArrayDE,
    sentencesArray: sentencesArrayDE,
    translationsArray: translationsArrayDE
  },
   RU: {
    wordsArray: wordsArrayRU,
    wordsTop1000Array: wordsTop1000ArrayRU,
    wordsFoodArray: wordsFoodArrayRU,
    wordsUsefulArray: wordsUsefulArrayRU,
    wordsCurseArray: wordsCurseArrayRU,
    sentencesArray: sentencesArrayRU,
    translationsArray: translationsArrayRU
  }
};

exports.allLangs = allLangs;
// exports.wordsTop1000Array = wordsTop1000Array;
// exports.wordsFoodArray = wordsFoodArray;
// exports.wordsUsefulArray = wordsUsefulArray;
// exports.wordsCurseArray = wordsCurseArray;
// exports.sentencesArray = sentencesArray;
// exports.translationsArray = translationsArray;
