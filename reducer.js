const fs = require('fs');
const path = require('path');

const USAGE = `
usage: node reducer.js <source dir>

Consumes a directory populated using recorder.js and creates a reduced set of
responses with only the interesting changes. Reduced response set will be saved
in a new directory <source>-reduced.
`;

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Missing argument');
  console.error(USAGE);
  process.exit(1);
}

const targetDir = path.join(
  path.dirname(sourceDir),
  path.basename(sourceDir) + '-reduced'
);

if (fs.existsSync(targetDir)) {
  console.error(`Target directory ${targetDir} already exists`);
  process.exit(1);
} else {
  fs.mkdirSync(targetDir);
}

const log = (message) => {
  console.log(message);
};

const isJsonFile = (file) => path.extname(file).toLowerCase() === '.json';

const readJsonFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
};

const isInteresting = (key) => {
  return (
    key !== 'timestamp' &&
    key !== 'version_hash' &&
    key !== 'live_time' &&
    key !== 'live_time_mmss' &&
    key !== 'last_modified'
  );
};

const compareJsonObjects = (obj1, obj2) => {
  const keys1 = Object.keys(obj1.score).filter(isInteresting);
  const keys2 = Object.keys(obj2.score).filter(isInteresting);

  let returnValue = false;
  for (const key of keys1) {
    if (obj1.score[key] !== obj2.score[key]) {
      log(`Diff at ${key}: ${obj1.score[key]} vs ${obj2.score[key]}`);
      returnValue = true;
    }
  }

  return returnValue;
};

const copyFile = (source, target) => {
  log(`Copying ${source} to ${target}`);
  fs.copyFileSync(source, target);
};

const main = () => {
  const files = fs.readdirSync(sourceDir).filter(isJsonFile).sort();

  let previousJson = null;

  for (const file of files) {
    const filePath = path.join(sourceDir, file);

    log(`Reading ${filePath}`);
    const currentJson = readJsonFile(filePath);

    if (previousJson && compareJsonObjects(previousJson, currentJson)) {
      const targetPath = path.join(targetDir, file);
      copyFile(filePath, targetPath);
    }

    previousJson = currentJson;
  }
};

main();
