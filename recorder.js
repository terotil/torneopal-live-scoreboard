const fs = require("fs");

const RATE = 5000; // milliseconds
const USAGE = `
usage: node recorder.js <api_key> <match_id>

Saves the result of a Torneopal API getScore to a file every ${RATE / 1000} s.
Creates a directory <match_id> for storing the recorded results.

api_key:  Your Torneopal API key
match_id: From https://tulospalvelu.salibandy.fi/match/<match_id>/
`;
let api_key, match_id;

async function getTorneopal(resource, params) {
  const urlParams = new URLSearchParams(params);
  const url = `https://salibandy.api.torneopal.com/taso/rest/get${resource}?${urlParams}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

// Check mandatory arguments
let error = false;
if (process.argv.length < 4) {
  error = "Missing arguments";
} else {
  api_key = process.argv[2];
  match_id = process.argv[3];
  // create a directory for storing the recorded results
  if (!fs.existsSync(match_id)) {
    fs.mkdirSync(match_id);
  } else {
    error = `Directory ${match_id} already exists`;
  }
}

if (error) {
  console.error(error);
  console.error(USAGE);
  process.exit(1);
}

// call getTorneopal every 10 seconds and write result json to a file with timestamp as the filename
setInterval(async () => {
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const result = await getTorneopal("Score", {
    api_key,
    match_id,
  });
  const filename = `${match_id}/result_${timestamp}.json`;

  fs.writeFile(filename, JSON.stringify(result), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Saved to ${filename}`);
    }
  });
}, RATE);
