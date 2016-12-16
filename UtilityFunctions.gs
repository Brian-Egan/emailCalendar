function hideBlankRows(sheetName) {
 var sheetName = sheetName == undefined ? "Weekly Breakdown" : sheetName 
 unHideRows(sheetName);
 var sheetToClean = SS.getSheetByName(sheetName);
 var startRow = 2;
 var lastRow = 110;
 var activeRange = sheetToClean.getRange(startRow, 1, lastRow, sheetToClean.getLastColumn());
 var values = activeRange.getValues();
  var blankRows = [];
  var i = startRow;
  _._each(values, function(x) {
    if (x[0] == "") {
      blankRows.push(i);
    }
    if (x[0] == "Week Of") {
      Logger.log("We should unhide " + (i - 1) + " which would be " + blankRows.pop());
    }
    i += 1;
  });
  _._each(blankRows, function(x) { sheetToClean.hideRows(x)});
}

function setMonday() {
  var sht = SS.getSheetByName("Weekly Breakdown");
  var rng = sht.getRange(1,2,1,1);
  var startDate = new Date((new Date()).valueOf() - ((24 * 60 * 60 * 1000) * 7));
  var mondays = _._filter(SHEET.getRange(2,11,SHEET.getLastRow(), 1).getValues(), function(c) { return c[0] >= startDate })[0];
  var nDate = new Date(mondays[0]);
  if (nDate >= startDate) {
//    Logger.log("We're good");
     rng.setValue(nDate);
  } 
}

function unHideRows(sheetName) {
 var sheetName = sheetName == undefined ? "Weekly Breakdown" : sheetName 
 var sheetToClean = SS.getSheetByName(sheetName);
 var startRow = 2;
 var lastRow = 111;
 var activeRange = sheetToClean.getRange(startRow, 1, lastRow, sheetToClean.getLastColumn());
 var values = activeRange.getValues();
 sheetToClean.unhideRow(activeRange);
}