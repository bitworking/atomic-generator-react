/* eslint-disable */
// const compile = require('./compile');
const render = require('./render');
const utils = require('./utils');
const navi = require('./navi');
const fs = require('./fs');

/*
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
*/



// compile(getComponentsData(folders), distFolder, webpackConfig);

const main = async () => {
  try {
    const output = await render.toString(
      './src/components/atomic/atoms/ButtonSwitch/ButtonSwitch',
      {
        "textOn": "An",  
        "textOff": "Aus"
      },
      './webpack.config',
      true,
    );
    console.log(output);
  }
  catch(error) {
    console.error(error);
  }
};

// main();

// console.log(fs.getJsonFiles('./src/components/atomic'));

const jsonFiles = fs.getJsonFiles('./src/components/atomic');
const atomicJsonArray = [];
for (const i in jsonFiles) {
  atomicJsonArray.push(fs.readJsonData(jsonFiles[i]));
}

const navigation = navi.getNavigationFromJson(atomicJsonArray);

console.log(navigation);

