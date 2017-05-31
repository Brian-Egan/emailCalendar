
function loadVariables() {
  CAL = CalendarApp.getCalendarById("bucp4uip0l5v5l2nk4amjg3uo4@group.calendar.google.com");
}

function keyColumns() {
  KEYS = KEYS == undefined ? KEYS : SHEET.getRange(1, 1, 1, SHEET.getLastColumn()).getValues()[0];
  i = 1;
  HEADERS = {};
  _._each(KEYS, function(x) { HEADERS[x] = i; i += 1});
  return HEADERS;
}


function lastRow() {
  return SHEET.getLastRow();
}

function lastCol() {
 return SHEET.getLastColumn(); 
}

function lastColumn() {
 return SHEET.getLastColumn(); 
}

function nextMonth() {
 nextMonth = new Date();
 nextMonth.setMonth(nextMonth.getMonth() + 1);
 return nextMonth;
};

function hoursFrom(dat, hours) {
  hourOut = dat
  hourOut.setHours(hourOut.getHours() + hours);
  return hourOut;
}

function isNull(arr) {
 return arr.join().replace(/,/g,'').length === 0 
}

function toEvent(obj) {
  nicks = abbrvs();
  nickname = nicks[obj['Network']];
  return {
    "title":  (nickname + ": " + obj['Show/Topic/Concept'] + " [" + obj['Promoting'] + "]"),
    "start": obj["Deploy Date"].addHours(DEFAULT_START_TIME),
    "end": obj['Deploy Date'].addHours(DEFAULT_START_TIME + DEFAULT_EVENT_LENGTH),
    "description": (obj["Notes"] + "\n---------\nAdditional Promotables: " + obj["Additional Promotables"]),
    "location": ("Status: " + obj['Status'])
  }
}
  
//  
//
//function eventTitle(obj) {
//  nicks = abbrvs();
//  nickname = nicks[obj['Network']];
//  return (nickname + ": " + obj['Show/Topic/Concept'] + " [" + obj['Promoting'] + "]"); 
//}
//
//function eventOptions(obj) {
//  
//}
//
//function eventLocation(obj) {
//  
//}
//
//function eventStart(obj) {
//  
//}
//
//function eventEnd(obj)