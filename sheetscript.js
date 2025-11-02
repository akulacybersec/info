function doPost(e) {
  var sheet = SpreadsheetApp.openById('1EnnXGigngEGTbt_76xN6o_WX8Ew0xPK2jlKktHVdfAo').getSheetByName('Sheet1');

  var data = e.parameter;
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.rating,
    data.review
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success", data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Add this new function to fetch reviews
function doGet(e) {
  var sheet = SpreadsheetApp.openById('1EnnXGigngEGTbt_76xN6o_WX8Ew0xPK2jlKktHVdfAo').getSheetByName('Sheet1');
  
  if (e.parameter.action === 'getReviews') {
    var data = sheet.getDataRange().getValues();
    var reviews = [];
    
    // Skip header row (if you have one) and get last 10 reviews
    // Adjust the starting index if you don't have a header row
    var startRow = Math.max(1, data.length - 10); // Change to 0 if no header
    
    for (var i = startRow; i < data.length; i++) {
      if (data[i][0]) { // Check if row has data
        reviews.push({
          date: data[i][0],
          name: data[i][1],
          email: data[i][2],
          rating: parseInt(data[i][3]),
          review: data[i][4] || '' // Handle empty reviews
        });
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ reviews: reviews.reverse() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Default response if no action parameter
  return ContentService
    .createTextOutput(JSON.stringify({ error: "No action specified" }))
    .setMimeType(ContentService.MimeType.JSON);
}