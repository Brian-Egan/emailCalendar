function onEdit(e){
  var range = e.range;
  var idIndex = KEYS.indexOf("ObjID") + 1;
  Logger.log("Triggered!");
  if (
    (range.getSheet().getSheetName() == SHEET.getSheetName()) 
    && (range.getColumn() <= (KEYS.indexOf("Notes") + 1))
    && (range.getRow() > 1)
  ) {
    if (range.getNumRows() > 1) {
      i = range.getRow();
      z = (range.getNumRows() + i);
      while (i <= z) {
        Logger.log("Setting row " + i);
        setRowIfNeeded(i);
        setUpdatedAtIfNeeded(i);
        i += 1;
      }
//      updateObjIds(i);
    } else {
      Logger.log("Updating - " + range.getRow());
      
      setRowIfNeeded(range.getRow());
      setUpdatedAtIfNeeded(range.getRow());
    }
  }
}

function setUpdatedAtIfNeeded(rowNum) {
  Logger.log("In updated at for row num " + rowNum);
//  if (isNull(SHEET.getRange(rowNum, 1, 1, KEYS.indexOf("Notes")).getValues()[0]) == false) {
  Logger.log(HEADERS);
  
  var lastCol = HEADERS["URL"];
  Logger.log("-------\n" + lastCol);
  if (isNull(SHEET.getRange(rowNum, 1, 1, lastCol).getValues()[0]) == false) {
    SHEET.getRange(rowNum, HEADERS['Updated At'], 1, 1).setValue(new Date());
//    SHEET.getRange(rowNum, KEYS.indexOf('Updated At') + 2, 1, 1).setValue("Updated " + Session.getEffectiveUser().getEmail());
  } else {
    SHEET.getRange(rowNum, HEADERS['Updated At'], 1, 1).setValue(null);
  }    
}

function setRowIfNeeded(rowNum) {
  var idIndex = idIndex || HEADERS["ObjID"];
  if (
     ((SHEET.getRange(rowNum, idIndex, 1).getValue() == "") == true)
    && (isNull(SHEET.getRange(rowNum, 1 , 1, HEADERS["Initial Creative Due"] - 1).getValues()[0]) == false)
    ) {
    setIdCell(rowNum);
 } else if ((isNull(SHEET.getRange(rowNum, 1 , 1, HEADERS["Initial Creative Due"] - 1).getValues()[0]) == true) && (SHEET.getRange(rowNum, HEADERS['GCal ID']).getValues()[0] == "")) {
  Logger.log("Removing? ID: " + SHEET.getRange(rowNum, idIndex, 1).getValue());
  setIdCell(rowNum, true);
  }
}

function setIdCell(rowNum, toNull) {
  var toNull = toNull || false;
  var idIndex = (KEYS.indexOf("ObjID") + 1);
  Logger.log("will find at " + rowNum + " and index " + idIndex);
  if (toNull == true) {
    var r = SHEET.getRange(rowNum, idIndex, 1, 1);
    SHEET.getRange(rowNum, idIndex, 1, 1).setValue(null);
  } else {
    SHEET.getRange(rowNum, idIndex, 1, 1).setValue(rowNum);
  }
//  updateObjIds(rowNum);
}

function formSubmit(e) {
  Logger.log("Form submitted");
  DO_RUN = false;
  SS.getSheetByName("variables").getRange("I1").setValue(true);
}

function hasNewFormData(set) {
 var set = set == undefined ? SS.getSheetByName("variables").getRange("I1").getValue() : SS.getSheetByName("variables").getRange("I1").setValue(set);
 return set;
}

function dataSheetLastUpdated(setUpdated) {
 var setUpdated = setUpdated == undefined ? SS.getSheetByName("variables").getRange("I2").getValue() : SS.getSheetByName("variables").getRange("I2").setValue(setUpdated);
 return setUpdated;
}

function updateIfNewData() {
  // This should run every ~10 min or so
  if (hasNewFormData() == true) {
    var lastUpdatedAt = dataSheetLastUpdated();
    var formSheet = SS.getSheetByName("Form Responses 1");
    var headers = formSheet.getRange(1,1,1,formSheet.getLastColumn()).getValues()[0];
    var formEntries = $.splitRangesToObjects(headers, formSheet.getRange(2,1, formSheet.getLastRow(), formSheet.getLastColumn()).getValues());
    var newEntries = _._filter(formEntries, function(x) { return (x.timestamp > lastUpdatedAt)});
    DATA_HEADERS = keyColumns();
    if (newEntries.length > 0) {
      _._each(newEntries, function(e) {
        var newRow = [
          e.requestedDeployDate, 
          e.network,
          e.showepisodetopiclistconceptToPromote,
          e.reasonForPromotion, 
          "Requested",
          e.requestedBy,
          ("PRIMARY MESSAGE: " + e.primaryMarketingMessage + "\nSECONDARY MESSAGE: " + e.secondaryMarketingMessage),
          e.additionalItemsToPromote,
          e.addtlInfonotes,
          e.link
        ];
        var lastRow = SHEET.appendRow(newRow).getLastRow();
        var formulas = SS.getSheetByName("rawFormulas").getRange(2,DATA_HEADERS['Initial Creative Due'],1,4).getFormulasR1C1();
        SHEET.getRange(lastRow, DATA_HEADERS['ObjID'], 1, 1).setValue(lastRow);
        DO_RUN = true;
      });
      newUpdatedAt = _._last(newEntries).timestamp; 
    } else {
      newUpdatedAt = new Date();
    }                 
    dataSheetLastUpdated(newUpdatedAt);
    hasNewFormData(false);
  } else {
//    Logger.log("Did not run. No new entries");
  }
}

function updateWithFormResponses(e) {
  // This is no longer used as of 3/29 - replaced with 'updateIfNewData()'
  var resp = e.namedValues;
  var newRow = [];
  var rowHeaders = [
		'Requested Deploy Date',
		'Network',
		'Show/Topic/List/Concept To Promote',
		'Reason for Promotion',
		'Requested',
		'Email Address',
		'Messaging and Notes',
        'Link',
        '',
        '','','','','','','Timestamp'
		];
  	_._each(rowHeaders, function(x) {
			if ((x == "Requested") || (x == "")) {
				newRow.push(x);
			} else {
              if (resp[x] == undefined) {
                MailApp.sendEmail("brian_egan@discovery.com", "Was undefined  " + x, "This was undefined \n" + resp[x])
                newRow.push("");
              } else {
				newRow.push(resp[x][0]);
              }
			}
		});
  var lastRow = SHEET.appendRow(newRow).getLastRow();
  var formulas = SS.getSheetByName("rawFormulas").getRange(2,HEADERS['Initial Creative Due'],1,4).getFormulasR1C1();
  SHEET.getRange(lastRow, HEADERS['Initial Creative Due'], 1, 4).setFormulasR1C1(formulas);
  SHEET.getRange(lastRow, HEADERS['ObjID'], 1, 1).setValue(lastRow);
  DO_RUN = true;
//  DO_RUN = false;
}

