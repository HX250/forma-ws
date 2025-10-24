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

function findLanguageFiles(dir, lang, results = []) {
  if (!fs.existsSync(dir)) return results;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      findLanguageFiles(fullPath, lang, results);
    } else if (entry.isFile() && entry.name === `${lang}.json`) {
      results.push(fullPath);
    }
  }
  
  return results;
}

function deepMerge(target, source, sourcePath, keysOrigin) {
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) {
        target[key] = {};
        keysOrigin[key] = [];
      }
      
      if (typeof target[key] !== 'object' || Array.isArray(target[key])) {
        console.error(
          `Type conflict for key '${key}': cannot merge object with non-object. Found in: ${sourcePath}`
        );
        hadError = true;
        continue;
      }
      
      keysOrigin[key].push(sourcePath);
      deepMerge(target[key], source[key], sourcePath, keysOrigin);
    } else {
      if (!keysOrigin.hasOwnProperty(key)) {
        keysOrigin[key] = [];
      }
      
      keysOrigin[key].push(sourcePath);
      
      if (target.hasOwnProperty(key)) {
        console.error(
          `Duplicate key found: '${key}' found in: ${keysOrigin[key].join(', ')}`
        );
        hadError = true;
      }
      
      target[key] = source[key];
    }
  }
  
  return target;
}

const availableLangs = new Set();
for (const appDir of content.apps) {
  const appPath = path.join(basePath, appDir);
  if (!fs.existsSync(appPath)) continue;
  
  for (const lang of langVariants) {
    const files = findLanguageFiles(appPath, lang);
    if (files.length > 0) {
      availableLangs.add(lang);
    }
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
    const appPath = path.join(basePath, directoryName);

    const langFiles = findLanguageFiles(appPath, lang);

    if (langFiles.length === 0) {
      console.warn(`No ${lang}.json files found in ${directoryName} — skipping`);
      continue;
    }

    console.log(`  Found ${langFiles.length} file(s) in ${directoryName}`);

    for (const filePath of langFiles) {
      const relativePath = path.relative(basePath, filePath);
      console.log(`    Processing: ${relativePath}`);

      const fileContents = fs.readFileSync(filePath, 'utf8');
      let addition = {};
      
      if (!fileContents || fileContents.trim() === '') {
        console.warn(`    Empty translation file ${relativePath} — treating as {}`);
        continue;
      }
      
      try {
        addition = JSON.parse(fileContents);
      } catch (e) {
        console.error(`    Error parsing JSON from ${relativePath}: ${e}`);
        hadError = true;
        continue;
      }

      deepMerge(merged, addition, relativePath, keysOrigin);
    }
  }

  try {
    fs.writeFileSync(mergedLangFilePath, JSON.stringify(merged, null, 2));
    console.log(`✓ Successfully wrote ${lang}.json`);
  } catch (e) {
    console.error(`Failed to write merged file ${mergedLangFilePath}: ${e}`);
    hadError = true;
  }
}

if (hadError) process.exit(1);
