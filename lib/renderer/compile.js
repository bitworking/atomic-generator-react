const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

let index = 0;
let componentsData = [];

const createDir = function(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createDir(dirname);
  fs.mkdirSync(dirname);
}

const getComponentName = function(fileName) {
  fileName = fileName.toLowerCase();
  fileName = fileName.replace(/\\/g, '/');
  let pathArray = fileName.replace('.js', '').split('/');
  pathArray = pathArray.filter(function(value, index, self) {return self.indexOf(value) === index;});
  let componentsIndex = pathArray.lastIndexOf('src');
  pathArray = pathArray.slice(componentsIndex + 1);
  let pathString = pathArray.join('-');
  return pathString.replace('components-atomic-', '');
}

const compileNext = function(distFolder, options) {
  if (index < componentsData.length) {
    compile(componentsData[index], distFolder, options);
  }
}

const getData = function(componentPath, componentName) {
  let data = {};
  let dataJsonFile = path.dirname(componentPath) + '/' + componentName + '.json';
  if (fs.existsSync(dataJsonFile)) {
    try {
      data = fs.readFileSync(dataJsonFile, 'utf8');
      data = JSON.parse(data);
    }
    catch(error) {
      console.error('Could not read data.json file: ' + error);
    }
  }
  return data;
}

const renderToString = function(compiledPath, data) {
  delete require.cache[require.resolve(compiledPath)];
  const component = require(compiledPath);
  return ReactDOMServer.renderToString(React.createFactory(component.default)(data));
}

const renderToTemplate = function(componentString, componentName, data) {
  const templateComponent = fs.readFileSync(path.resolve(__dirname, 'templates/component_single.html'), 'utf8');
  let output = componentString;

  // relace template placeholders
  output = templateComponent.replace(/{{COMPONENT}}/g, output);
  output = output.replace(/{{COMPONENT_NAME}}/g, componentName);
  output = output.replace(/{{COMPONENT_DATA}}/g, JSON.stringify(data));
  return output;
}

const compile = function(componentData, distFolder, options) {
  options.entry = componentData.file;
  const compiler = webpack(options);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    if (stats.hasErrors()) {
      console.error(stats.toJson().errors);
      return;
    }

    // get component name
    const componentName = path.basename(options.entry, path.extname(options.entry));
    const componentNameData = getComponentName(options.entry);

    // require renderer component
    // require cache must be deleted (this is a kind of bug hard to find)
    const outputFile = `${compiler.options.output.path}/${compiler.options.output.filename}`;
   
    // get data
    let data = getData(options.entry, componentName);

    if (data['$data']) {
      if (!Array.isArray(data['$data'])) {
        data = [data['$data']];
      }
      else {
        data = data['$data'];
      }
    }
    else {
      data = [data];
    }

    let output = '';

    for (let i in data) {
      let componentData = data[i]['$data'] ? data[i]['$data'] : data[i];
      let outputComponent = renderToString(outputFile, componentData);
      outputComponent = renderToTemplate(outputComponent, componentNameData, componentData);
      output += outputComponent;
    }

    // read main template into string
    const templateMain = fs.readFileSync(path.resolve(__dirname, 'templates/component.html'), 'utf8');

    // replace template placeholders
    output = templateMain.replace(/{{COMPONENT}}/g, output);
    output = output.replace(/{{COMPONENT_NAME}}/g, componentName);

    // write file
    const distPath = distFolder +'/'+ componentData.folderObject.name +'/'+ componentName +'/'+ componentName +'.html';

    createDir(distPath);
    fs.writeFileSync(distPath, output);
    fs.unlinkSync(outputFile);

    // compile next file
    index++;
    compileNext(distFolder, options);
  });
}

module.exports = function (components, distFolder, options) {
  componentsData = components;
  if (componentsData.length) {
    compile(componentsData[index], distFolder, options);
  }
}
