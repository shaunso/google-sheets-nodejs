import express, { raw } from 'express';
import { google } from 'googleapis';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // create client instance for auth
  const client = await auth.getClient();

  // instance of google sheets api
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1Sxm6gD3T25YFJShoVeKCBt0n3gHzA9DwU-b_kJoHSE0'

  // get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    // range: 'participants',
    range: 'participants',
  });

  // write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "participants!A:B",
    valueInputOption: "RAW",
    // valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [54-10, '15550009842'],
        ['crazy cakfhfp', '2020-10-05'],
        ['+27-620738084', 'hello', 'world', 'I won\'t appear']
      ]
    }
  })

  res.send(getRows.data)
  
})

app.listen( PORT, () => console.log(`The server is listening for client requests at http://localhost:${PORT}/`) );