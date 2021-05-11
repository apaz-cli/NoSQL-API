import { DBConnection, DBCollection } from './BaseClasses.js';

import express from 'express';
const app = express();
const port = 3000;

// defines req.body as an object
app.use(express.json());

app.use('/', (req, res) => {
  console.log(req.headers);
  console.log(req.body.debug);
  console.log(req.body.action);
  console.log(req.body.action_body);
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}.`)
});

// Runner waits for the 
async function testRunner() {
  // Sleep for 1 second to allow the server to start, then start the test.
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("\nSTARTING TEST.");
  testDB();
}
testRunner();


async function testDB() {
  const conn = new DBConnection(`http://localhost:${port}/`, "API_KEY");

  try {
    let result;
    result = await conn.collection('Users').document('DOC_ID').get();
  } catch (e) { console.log(e) }
}
