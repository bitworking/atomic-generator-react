/* eslint-disable */
const fs = require('fs');
const path = require('path');
const webpackConfig = require('./webpack.config');
const compile = require('./compile');


const distFolder = './dist/atomic';
const folders = [
  {
    folder: './src/components/atomic/atoms',
    name: 'atoms',
    links: [{ title: 'atomic', link: '../../atomic/index.html' }, { title: 'atoms', link: '../atoms/index.html' }],
  },
  {
    folder: './src/components/atomic/molecules',
    name: 'molecules',
    links: [{ title: 'atomic', link: '../../atomic/index.html' }, { title: 'molecules', link: '../molecules/index.html' }],
  },
];

const getAllFiles = (dir, filelist) => {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = getAllFiles(path.join(dir, file), filelist);
    }
    else {
      const absolutePath = path.join(dir, file);
      filelist.push(`./${absolutePath}`);
    }
  });
  return filelist;
}

const getComponentsData = (folders) => {
  const componentsData = [];
  for (let i in folders) {
    const files = getAllFiles(folders[i].folder);
    for (let j in files) {
      if (path.extname(files[j]) === '.json') {
        continue;
      }
      componentsData.push({
        file: files[j],
        folderObject: folders[i]
      });
    }
  }
  return componentsData;
};

compile(getComponentsData(folders), distFolder, webpackConfig);
