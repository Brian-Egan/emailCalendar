SS = SpreadsheetApp.getActiveSpreadsheet();
SHEET = SS.getSheetByName("data");
KEYS = SHEET.getRange(1, 1, 1, SHEET.getLastColumn()).getValues()[0];
DEFAULT_START_TIME = 9; // Hours
DEFAULT_EVENT_LENGTH = 2; //Hours
//DO_RUN = true;
DO_RUN = false;

// Need tofix the bug that is overwriting the head in column L (Object ID)


COLUMNS = keyColumns();

function sortCalendar() {
  loadVariables();
  updatedAt = DriveApp.getFileById(SS.getId()).getLastUpdated();
  if (((new Date() - updatedAt)/60000) > 5) {
    // More than 5 minutes has elapsed.
    allRows = getNonBlankRows(SHEET, true);
    allRows = _._filter(allRows, function(x) { return (x[0] != "")});
    rowObjs = $.splitRangesToObjectsNoCamel(KEYS, allRows);  
    rowObjs = _._sortBy(rowObjs, function(x) { return x['Deploy Date'] });
    newRows = _._map(rowObjs, function(x) { return _._values(x)});
    SHEET.getRange(2, 1, newRows.length, newRows[0].length).setValues(newRows);
    updateObjIds();
  }
}

function abbrvs() {
  raw = SS.getSheetByName("variables").getRange(2, 5, 10, 2).getValues();
  nicknames = {};
//  _._each(raw, function(x) { abbrvs[x[0]] = x[1]});
  _._map(raw, function(x) { return (nicknames[x[0]] = x[1])});
  return nicknames;
}


function rowToObject(rowNum) {
  var arr = SHEET.getRange(rowNum, 1, 1, SHEET.getLastColumn().getValues()[0]).getValues()[0];
  obj = {};
  for (x in arr) { 
   obj[KEYS[x]] = arr[x]; 
  }
  Logger.log(obj);
  return obj; 
}


function rowArrayToObject(arr) {
// arr = SHEET.getRange(rowNum, 1, 1, SHEET.getLastColumn()).getValues()[0]).getValues()[0];
  var obj = {};
  for (x in arr) { 
//   Logger.log("| " + KEYS[x] + " = " + arr[x]);
   obj[KEYS[x]] = arr[x]; 
  }
  Logger.log(obj);
  return obj; 
}

function getNonBlankRows(sht, hasHeader) {
  var sht = sht || SHEET;
  var hasHeader = hasHeader || true;
  if (hasHeader == true) {
   numRows = sht.getLastRow() - 1;
    startRow = 2;
  } else {
    numRows = sht.getLastRow();
    startRow = 1;
  }
  allRows = sht.getRange(startRow, 1, numRows, sht.getLastColumn()).getValues();
//  allRows = setIds(allRows);
  allRows = _._filter(allRows, function(x) { return (x[0] != "")});
  return allRows;
}

function getDeletedRowsWithGCalIds(sht, hasHeader) {
  var sht = sht || SHEET;
  var hasHeader = hasHeader || true;
  if (hasHeader == true) {
   numRows = sht.getLastRow() - 1;
    startRow = 2;
  } else {
    numRows = sht.getLastRow();
    startRow = 1;
  }
  allRows = sht.getRange(startRow, 1, numRows, sht.getLastColumn()).getValues();
//  allRows = setIds(allRows);
  Logger.log(allRows.length);
  allRows = _._filter(allRows, function(x) { return ((x[0] == "") && ((KEYS.indexOf('GCal ID') + 1) != ""))});
  Logger.log(allRows);
  return allRows;
}

function syncDeletedEventsAndUpdateIds() {
    loadVariables();
 var rows = getDeletedRowsWithGCalIds(SHEET, true);
  if (rows.length > 0) {
 var rowObjs = $.splitRangesToObjectsNoCamel(KEYS, rows); 
 Logger.log(rowObjs.length);
 Logger.log(rowObjs);
 var resetStartRow = rowObjs[0]["ObjID"];
  Logger.log(resetStartRow - 1);
  _._each(rowObjs, function(r) {
    deleteEventFromGCal(r['GCal ID']);
    SHEET.deleteRow(r['ObjID']);
    
  });
 updateObjIds(resetStartRow); 
  }
}

function deleteEventFromGCal(gcalId) {
//  Logger.log("the event id is " + gcalId);
  var evnt = CAL.getEventSeriesById(gcalId);
//  Logger.log(evnt.length);
//  Logger.log(evnt.getTitle());
//  Logger.log(evnt.getId());
//  Logger.log(evnt[0]);
//  Logger.log(evnt.getVisibility());
  try {
     evnt.deleteEventSeries();
}
catch(err) {
    Logger.log("Error! \n " + err);
  return;
}
 
}

function updateObjIds(startAt) {
 var startAt = (startAt - 1) || 2;
  if ((startAt < 2) == true) {
    startAt = 2;
  }
// Logger.log("startAt is set it " + startAt);
//  Logger.log("And our last row is " + SHEET.getLastRow());
 var GCalIDs = SHEET.getRange(startAt, 12, SHEET.getLastRow(), 1).getValues();
//  Logger.log("IDs length is " + GCalIDs.length);
  Logger.log(GCalIDs);
 var endAt = _._filter(GCalIDs, function(x) { return (x[0] != "")}).length;
 Logger.log(endAt);
 var currRow = startAt;
  while (currRow <= endAt) {
   setIdCell(currRow, false); 
    currRow += 1;
  }
}

          
function setIds(arr) {
// i = 1;
  // Eventually something like this should run onEdit() when a new row of data is added and assign it a protected ID then.
  startRow = 2;
 IdsCol = SHEET.getRange(2, KEYS['ObjID'], arr.length, 1);
 
  var list = [];
  for (var i = startRow; i <= (arr.length + startRow); i++) {
//    if 
//      list.push(i);
  }
}


function rowsToObjects(allRows) {
  allRows = allRows || getNonBlankRows(SHEET, true);
  objects = _._map(allRows, function(x) { return rowArrayToObject(x)});
  Logger.log("Now as one object!\n---------\n");
  Logger.log(objects);
  Logger.log(objects[1]["Network"]); 
}

function countRows(arr) {
  Logger.log("There are " + arr.length + " rows in the active range");  
}

function runTrigger() {
  if (DO_RUN == true) {
   syncSheetToCalendar(); 
  }
}


function syncSheetToCalendar() {
  loadVariables();
  updateObjIds();
  allRows = getNonBlankRows(SHEET, true);
  allRows = _._filter(allRows, function(x) { return (x[0] != "")});
  countRows(allRows);
  allRows = $2D.filterByDate(allRows, 0, new Date(), new Date().addMonths(1));
  countRows(allRows);
  rowObjs = $.splitRangesToObjectsNoCamel(KEYS, allRows);  
  _._each(rowObjs, function(x) {
    setUpdatedTo = new Date();
    if ((x["GCal ID"] == "") == true) {
      x['GCal ID'] = addToCalendar(x);
      x["Updated At"] = setUpdatedTo;
    } else {
      
      event = CAL.getEventSeriesById(x["GCal ID"]);
      if (x['Updated At'] > event.getLastUpdated())  {
//      if 
        Logger.log("Updated at is " + x["Updated At"]);
        Logger.log("Event updated at is " + event.getLastUpdated());
      
      // if event.getLastUpdated() > obj['Updated At'] - Use to not do every one and only get changed.
        ev = toEvent(x);
        event.setTitle(ev.title);
        event.setLocation(ev.location);
        event.setDescription(ev.description);
//          event.setTime(ev.start, ev.end);
        event.setRecurrence(CalendarApp.newRecurrence().addDailyRule().times(1), ev.start, ev.end);
        x["Updated At"] = setUpdatedTo;
      } else {
        Logger.log("Updated at is " + x["Updated At"]);
        Logger.log("Event updated at is " + event.getLastUpdated());
      }
    }
//    x["Updated At"] = setUpdatedTo;
      
  
   
    SHEET.getRange(x['ObjID'], 1, 1, _._keys(x).length).setValues([_._values(x)]);
  });
   // Now something to delete events that have been deleted from the calendar....
    // get_emptied_rows (these are the ones which have a GCal ID but nothing in Cols A-F
    // iterate on each of those row's GCal ids and delete event.
   syncDeletedEventsAndUpdateIds();
  updateObjIds();
  
  
}



function addToCalendar(obj) {
 nicks = abbrvs();
 nickname = nicks[obj['Network']];
 ev = toEvent(obj);
  newEvent = CAL.createEvent(ev.title, ev.start, ev.end, {
    "description": ev.description,
    "location": ev.location
  })
  
//  newEvent = CAL.createEvent((nickname + ": " + obj['Show/Topic/Concept'] + " [" + obj['Promoting'] + "]"), obj["Deploy Date"].addHours(DEFAULT_START_TIME), obj['Deploy Date'].addHours(DEFAULT_START_TIME + DEFAULT_EVENT_LENGTH), {
//    "description":  obj['Notes'],
//    "location": ("Status: " + obj['Status'])
//  });
 return newEvent.getId();
  
}

function tes() {
  tRows = SHEET.getRange(1, 1, lastRow(), lastCol()).getValues()
//  countRows(tRows);
  nRows = $2D.filterByValue(tRows, 0, !"");
  countRows(nRows);
}
