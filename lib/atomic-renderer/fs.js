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
  fs.writeFileSync(distPath, content);
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
    } catch (error) {
      console.error(`Could not read atomic.json file: ${error}`);
    }
  }
  return data;
};

module.exports = {
  createDir,
  writeFile,
  getJsonFiles,
  readJsonData,
};
