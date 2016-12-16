function onEdit(e){
  var range = e.range;
  var idIndex = KEYS.indexOf("ObjID") + 1;
  Logger.log("Triggered!");
  if (
    (range.getSheet().getSheetName() == SHEET.getSheetName()) 
//    && (range.getColumn() != idIndex)
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
      setRowIfNeeded(range.getRow());
      setUpdatedAtIfNeeded(range.getRow());
//      updateObjIds(range.getRow());
    }
  }
}

function setUpdatedAtIfNeeded(rowNum) {
  if (isNull(SHEET.getRange(rowNum, 1, 1, KEYS.indexOf("Notes")).getValues()[0]) == false) {
    SHEET.getRange(rowNum, KEYS.indexOf('Updated At') + 1, 1, 1).setValue(new Date());
//    SHEET.getRange(rowNum, KEYS.indexOf('Updated At') + 2, 1, 1).setValue("Updated " + Session.getEffectiveUser().getEmail());
  } else {
    SHEET.getRange(rowNum, KEYS.indexOf('Updated At') + 1, 1, 1).setValue(null);
  }    
}

function setRowIfNeeded(rowNum) {
  var idIndex = idIndex || (KEYS.indexOf("ObjID") + 1);
  if (
     ((SHEET.getRange(rowNum, idIndex, 1).getValue() == "") == true)
    && (isNull(SHEET.getRange(rowNum, 1 , 1, KEYS.indexOf("Notes")).getValues()[0]) == false)
    ) {
    setIdCell(rowNum);
 } else if ((isNull(SHEET.getRange(rowNum, 1 , 1, KEYS.indexOf("Notes")).getValues()[0]) == true) && (SHEET.getRange(rowNum, 11).getValues()[0] == "")) {
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
  DO_RUN = false;
  var resp = e.namedValues;
  var newRow = [];
  	_._each([
		'Requested Deploy Date',
		'Network',
		'Show/Topic/List/Concept To Promote',
		'Reason for Promotion',
		'Requested',
		'Email Address',
		'Notes',
        '','','','','','','Timestamp'
		], function(x) {
			if ((x == "Requested") || (x == "")) {
				newRow.push(x);
			} else {
				newRow.push(resp[x][0]);
			}
		});
  var lastRow = SHEET.appendRow(newRow).getLastRow();
  var formulas = SS.getSheetByName("rawFormulas").getRange("h2:k2").getFormulasR1C1();
  SHEET.getRange(lastRow, KEYS.indexOf('Notes') + 2, 1, 4).setFormulasR1C1(formulas);
//  updateObjIds();
  SHEET.getRange(lastRow, KEYS.indexOf('ObjID') + 1, 1, 1).setValue(lastRow);
  DO_RUN = true;
}
