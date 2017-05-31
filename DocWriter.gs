// Written by Brian start 5-24-17

function writeDoc(txt, docUrl) {
  docUrl = docUrl || "https://docs.google.com/document/d/1LEVEVeDNjgm1ZlNrQYD0zw3a1HgRpK6LOCmfSiE5vsw/edit?usp=sharing"
//  https://docs.google.com/document/d/1LEVEVeDNjgm1ZlNrQYD0zw3a1HgRpK6LOCmfSiE5vsw/edit/
  // Great for logging, but it can't be called from a Spreadsheet cell function!
  txt = txt || "This is example text\nAnd this is on a new line\nand hello";
  doc = DocumentApp.openByUrl(docUrl);
  body = doc.getBody();
  Logger.log(typeof(body));
//  body.setText(txt);
  body.setText("");
  text = body.editAsText();
  text.setBold(false);
  syncSheetToDoc(text);
  Logger.log(text);
  Logger.log(text.getText().length);
}  




function writeTopLine() {
 docUrl = "https://docs.google.com/document/d/1Knvequ6KGhuPODHcGfswD53rOqnmFUHs1oBxhgJZpuo/edit?usp=sharing"
 doc = DocumentApp.openByUrl(docUrl);
 body = doc.getBody();
 body.setText("");
 text = body.editAsText();
 text.setBold(false);
 syncTopLineToDoc(text);
}

function syncTopLineToDoc(text) {
  loadVariables();
  updateObjIds();
  updateIfNewData();
  yesterday = new Date(new Date() - (60 * 60 * 24 * 1000));
  SS.toast("Syncing to calendar"); 
  allRows = getNonBlankRows(SHEET, true);
  allRows = _._filter(allRows, function(x) { return (x[0] != "")});
  countRows(allRows);
  allRows = $2D.filterByDate(allRows, 0, new Date(), new Date().addMonths(2));
  countRows(allRows);
  rowObjs = $.splitRangesToObjectsNoCamel(KEYS, allRows);  
  outputStr = "";
  txtKeys = [
    "Network",
    "Show/Topic/Concept",
    "Deploy Date",
  ];
  rowObjs = _._sortBy(rowObjs, function(x) { return x['Deploy Date']});
  _._each(rowObjs, function(x) {
    if (x['Deploy Date'] > yesterday)  {
        Logger.log("adding!");
        eventStr = "\n\n------\n";
      text.appendText("\n---------\n");
      _._each(txtKeys, function(k) {

        if (k == "Notes") {
          v = x[k].split("\n");
          _._each(v, function(r) { appendFormattedText(r.split(": ")[0], r.split(": ")[1], text)});
        } else {
          appendFormattedText(k, x[k], text);
        }
        

        
        
      });
//      outputStr += eventStr;
//        ev = toEvent(x);
      } else {
        Logger.log("skipped!");
      }
    });
//  writeDoc(outputStr);
  
}


function syncSheetToDoc(text) {
  loadVariables();
  updateObjIds();
  updateIfNewData();
  yesterday = new Date(new Date() - (60 * 60 * 24 * 1000));
  SS.toast("Syncing to calendar"); 
  allRows = getNonBlankRows(SHEET, true);
  allRows = _._filter(allRows, function(x) { return (x[0] != "")});
  countRows(allRows);
  allRows = $2D.filterByDate(allRows, 0, new Date(), new Date().addMonths(2));
  countRows(allRows);
  rowObjs = $.splitRangesToObjectsNoCamel(KEYS, allRows);  
  outputStr = "";
  txtKeys = [
    "Network",
    "Show/Topic/Concept",
    "Deploy Date",
    "Promoting",
    "Notes",
    "Requested By", 
    "Additional Promotables", 
    "Additional Info", 
    "URL"
  ];
  rowObjs = _._sortBy(rowObjs, function(x) { return x['Deploy Date']});
  _._each(rowObjs, function(x) {
    if (x['Deploy Date'] > yesterday)  {
        Logger.log("adding!");
        eventStr = "\n\n------\n";
      text.appendText("\n---------\n");
      _._each(txtKeys, function(k) {

        if (k == "Notes") {
          v = x[k].split("\n");
          _._each(v, function(r) { appendFormattedText(r.split(": ")[0], r.split(": ")[1], text)});
        } else {
          appendFormattedText(k, x[k], text);
        }
        

        
        
      });
//      outputStr += eventStr;
//        ev = toEvent(x);
      } else {
        Logger.log("skipped!");
      }
    });
//  writeDoc(outputStr);
  
}

"PRIMARY MESSAGE: New series SECONDARY MESSAGE: unlocked"


function appendFormattedText(key, value, text) {
  tl = text.getText().length;
  text.appendText("\n" + key + ": ");
  text.setBold(tl + 1, (tl + key.length + 1), true);
  v = (typeof(value) == "object" ? value.toDateString() : value);
  text.appendText(v);
}


function addToDoc(obj) {
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