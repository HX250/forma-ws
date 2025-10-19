const fs = require('fs');
const path = require('path');

const basePath = 'apps/web/public/assets/lang';
const langConfigFileName = 'lang.config.json';

const langVariants = ['en', 'sk'];

const configPath = path.join(basePath, langConfigFileName);

if (!fs.existsSync(configPath)) {
  console.error(`Config file not found at ${configPath}`);
  process.exit(1);
}

const content = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const outputDir = path.join(basePath, 'merged-adminapp');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let hadError = false;

const availableLangs = new Set();
for (const appDir of content.apps) {
  const appPath = path.join(basePath, appDir);
  if (!fs.existsSync(appPath)) continue;
  const files = fs.readdirSync(appPath);
  for (const f of files) {
    const m = f.match(/^([^.]+)\.json$/);
    if (m) availableLangs.add(m[1]);
  }
}

const langsToProcess = langVariants.filter((l) => availableLangs.has(l));
if (langsToProcess.length === 0) {
  langsToProcess.push(...Array.from(availableLangs));
}

for (const lang of langsToProcess) {
  const mergedLangFilePath = path.join(outputDir, lang + '.json');
  console.log(`Merging files for language: ${lang}`);

  const merged = {};
  const keysOrigin = {};

  for (let j = 0; j < content.apps.length; j++) {
    const directoryName = content.apps[j];

    const filePath = path.join(basePath, directoryName, lang + '.json');
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found at ${filePath} — skipping`);
      continue;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    let addition = {};
    if (!fileContents || fileContents.trim() === '') {
      console.warn(`Empty translation file ${filePath} — treating as {}`);
    } else {
      try {
        addition = JSON.parse(fileContents);
      } catch (e) {
        console.error(`Error parsing JSON from ${filePath}: ${e}`);
        hadError = true;
        continue;
      }
    }

    for (const key in addition) {
      if (Object.prototype.hasOwnProperty.call(addition, key)) {
        if (!keysOrigin.hasOwnProperty(key)) {
          keysOrigin[key] = [];
        }

        keysOrigin[key].push(directoryName);

        if (merged.hasOwnProperty(key)) {
          console.error(
            `Duplicate key found: '${key}' found in: ${keysOrigin[key].join(
              ', '
            )}`
          );
          hadError = true;
        }
      }
    }

    Object.assign(merged, addition);
  }

  try {
    fs.writeFileSync(mergedLangFilePath, JSON.stringify(merged, null, 2));
  } catch (e) {
    console.error(`Failed to write merged file ${mergedLangFilePath}: ${e}`);
    hadError = true;
  }
}

if (hadError) process.exit(1);
