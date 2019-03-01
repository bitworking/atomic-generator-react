const path = require('path');
const fs = require('fs');

const createDir = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createDir(dirname);
  fs.mkdirSync(dirname);
  return true;
};

const writeFile = (distPath, content) => {
  createDir(distPath);
  if (fs.existsSync(distPath)) {
    fs.unlinkSync(distPath);
  }
  fs.writeFileSync(distPath, content);
};

const removeFiles = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(dir, file), err => {
        if (err) throw err;
      });
    }
  });
};

const getJsonFiles = (dir, filelist) => {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = getJsonFiles(path.join(dir, file), filelist);
    }
    else {
      if (path.basename(file) === 'atomic.json') {
        const absolutePath = path.join(dir, file);
        filelist.push(`./${absolutePath}`);
      }
    }
  });
  return filelist;
};

const readJsonData = (atomicJsonPath) => {
  let data = {};
  if (fs.existsSync(atomicJsonPath)) {
    try {
      data = fs.readFileSync(atomicJsonPath, 'utf8');
      data = JSON.parse(data);
      data.folder = path.dirname(atomicJsonPath);
    } catch (error) {
      console.error(`Could not read atomic.json file: ${error}`);
    }
  }
  return data;
};

const getAtomicJsonArray = (entry) => {
  const jsonFiles = getJsonFiles(entry);
  const atomicJsonArray = [];
  for (const i in jsonFiles) {
    atomicJsonArray.push(readJsonData(jsonFiles[i]));
  }
  return atomicJsonArray;
};

module.exports = {
  createDir,
  writeFile,
  removeFiles,
  getJsonFiles,
  readJsonData,
  getAtomicJsonArray,
};
