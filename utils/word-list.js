var Excel = require("exceljs");

var wb = new Excel.Workbook();
var path = require("path");
var wordsFilePath = path.resolve(__dirname, "../wordlist.xlsx");
var sentencesFilePath = path.resolve(__dirname, "../sentencelist.xlsx");

const wordsArray = [];

const sentencesArray = [];
const translationsArray = [];

wb.xlsx.readFile(sentencesFilePath).then(function() {
  var sh = wb.getWorksheet("German");

  for (i = 1; i <= sh.rowCount; i++) {
    sentencesArray.push(sh.getRow(i).getCell(1).value);
    translationsArray.push(sh.getRow(i).getCell(2).value);
  }
});

wb.xlsx.readFile(wordsFilePath).then(function() {
  var sh = wb.getWorksheet("German");

  for (i = 1; i <= sh.rowCount; i++) {
    wordsArray.push({number: sh.getRow(i).getCell(1).value, word: sh.getRow(i).getCell(2).value, definition: sh.getRow(i).getCell(3).value, categories: sh.getRow(i).getCell(4).value});
  }
});

exports.wordsArray = wordsArray;
exports.sentencesArray = sentencesArray;
exports.translationsArray = translationsArray;
