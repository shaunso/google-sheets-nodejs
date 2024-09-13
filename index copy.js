import express from 'express';
import { google } from 'googleapis';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT || 3001;
const clientEmail = process.env.CLIENT_EMAIL;
const privateKey = process.env.PRIVATE_KEY;
const googleSheetId = process.env.GOOGLE_SHEET_ID;
const googleSheetPage = process.env.GOOGLE_SHEET_PAGE;

// authenticate the service account
const googleAuth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey.replace(/\\n/g, '\n'),
    'https://www.googleapis.com/auth/spreadsheets'
);

async function readSheet() {
  try {
    // google sheet instance
    const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});
    // read data in the range in a sheet
    const infoObjectFromSheet = await sheetInstance.spreadsheets.values.get({
        auth: googleAuth,
        spreadsheetId: googleSheetId,
        range: `${googleSheetPage}!A2:D6`
    });
    
    const valuesFromSheet = infoObjectFromSheet.data.values;
    console.log(valuesFromSheet);
  }
  catch(err) {
    console.log("readSheet func() error", err);  
  }
}

readSheet();

async function updateSheet() {
  try {
    // google sheet instance
    const sheetInstance = await google.sheets({ version: 'v4', auth: googleAuth});

    const updateToGsheet = [
      [ 'Seoul', '9,776,000', 'Asia', 'KRW' ],
      [ 'Copenhagen', '602,000', 'Europe', 'EUR' ],
      [ 'Amsterdam', '821,000', 'Europe', 'EUR' ],
      [ 'Helsinki', '631,000', 'Europe', 'EUR' ],
      [ 'Sydney', '5,312,000', 'Oceania', 'AUD' ]
    ];
    
    // update data in the range
    await sheetInstance.spreadsheets.values.update({
        auth: googleAuth,
        spreadsheetId: googleSheetId,
        range: `${googleSheetPage}!A2:D6`,
        valueInputOption: 'RAW',
        resource: {
          values: updateToGsheet,
        },
    });
  }
  catch(err) {
    console.log("updateSheet func() error", err);  
  }
}

updateSheet();

app.listen( PORT, () => console.log(`The server is listening for client requests at http://localhost:${PORT}/`) );
