const path = require('path');
const fs = require('fs');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

const createDir = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createDir(dirname);
  fs.mkdirSync(dirname);
  return true;
};

const getComponentName = (fileNameOrg) => {
  let fileName = fileNameOrg.toLowerCase();
  fileName = fileName.replace(/\\/g, '/');
  let pathArray = fileName.replace('.js', '').split('/');
  pathArray = pathArray.filter((value, index, self) => (self.indexOf(value) === index));
  const componentsIndex = pathArray.lastIndexOf('src');
  pathArray = pathArray.slice(componentsIndex + 1);
  const pathString = pathArray.join('-');
  return pathString.replace('components-atomic-', '');
};

const getData = (componentPath, componentName) => {
  let data = {};
  const dataJsonFile = `${path.dirname(componentPath)}/${componentName}.json`;
  if (fs.existsSync(dataJsonFile)) {
    try {
      data = fs.readFileSync(dataJsonFile, 'utf8');
      data = JSON.parse(data);
    } catch (error) {
      console.error(`Could not read data.json file${error}`);
    }
  }
  return data;
};

const renderToString = (compiledPath, data, stateful) => {
  delete require.cache[require.resolve(compiledPath)];
  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  const component = require(compiledPath);
  let string = '';
  if (stateful) {
    string = ReactDOMServer.renderToString(React.createFactory(component.default)(data));
  } else {
    string = ReactDOMServer.renderToStaticMarkup(React.createFactory(component.default)(data));
  }
  return string;
};

const renderToTemplate = (componentString, componentName, data, stateful) => {
  const template = stateful ? 'templates/component.single' : 'templates/component.single.stateless';
  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  return require(path.resolve(__dirname, template))(
    componentString, componentName, JSON.stringify(data),
  );
};

module.exports = {
  createDir,
  getComponentName,
  getData,
  renderToString,
  renderToTemplate,
};
