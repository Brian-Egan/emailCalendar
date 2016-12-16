function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('GO Calendar Functions')
      .addItem('Sync now', 'runTrigger')
      .addSeparator()
      .addItem('Generate Smartlink', 'generateSmartlink')
      .addToUi();
}

function generateSmartlink() {
  showAlert("Generate Smartlink cfor row " + SpreadsheetApp.getActiveRange().getRow());
  
}


function showAlert(txt) {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
     '',
     txt,
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert('Confirmation received.');
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Permission denied.');
  }
}

             
             
             
             
             