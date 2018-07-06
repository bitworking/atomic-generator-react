const MemoryFS = require('memory-fs');
const fs = require('fs');
const path = require('path');
const options = require('./webpack.config');
const compile = require('./compile');

const distFolder = './dist/atomic';
const componentsFolder = './src/components/atomic';

//const componentPath = 'atoms/ButtonSwitch/ButtonSwitch.js';
//const componentPath = 'molecules/Block/Block.js';

const getAllFiles = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = getAllFiles(path.join(dir, file), filelist);
    }
    else {
      const absolutePath = path.join(dir, file);
      const relativePath = path.dirname(absolutePath)+'/'+file;
      filelist.push('./'+absolutePath);
    }
  });
  return filelist;
}

const folders = [
  {folder: './src/components/atomic/atoms', name: 'atoms', links: [{title: 'atomic', link: '../../atomic/index.html'}, {title: 'atoms', link: '../atoms/index.html'}]},
  {folder: './src/components/atomic/molecules', name: 'molecules', links: [{title: 'atomic', link: '../../atomic/index.html'}, {title: 'molecules', link: '../molecules/index.html'}]},
];

const componentsData = [];

for (let i in folders) {
  const files = getAllFiles(folders[i].folder);
  for (let j in files) {
    componentsData.push({
      file: files[j],
      folderObject: folders[i]
    });
  }
}

compile(componentsData, distFolder, options);

