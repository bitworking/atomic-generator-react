const path = require('path');
const fs = require('fs');
const ReactDOMServer = require('react-dom/server');
const React = require('react');
const pretty = require('pretty');
const templateComponentSingleStateless = require('./templates/component.single.stateless');
const templateComponentSingle = require('./templates/component.single');

/*
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
*/

/*
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
*/

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

const renderToTemplate = (componentString, componentName, componentProps, stateful) => {
  const templateFunction = stateful ? templateComponentSingle : templateComponentSingleStateless;
  return templateFunction(
    componentString, componentName, JSON.stringify(componentProps),
  );
};

const beautify = html => pretty(html);



module.exports = {
  //getComponentName,
  //getData,
  renderToString,
  renderToTemplate,
  beautify,
};
