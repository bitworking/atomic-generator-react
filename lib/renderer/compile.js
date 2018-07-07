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

const renderToString = function(compiledPath, data, stateful) {
  delete require.cache[require.resolve(compiledPath)];
  const component = require(compiledPath);
  let string = '';
  if (stateful) {
    string = ReactDOMServer.renderToString(React.createFactory(component.default)(data));
  }
  else {
    string = ReactDOMServer.renderToStaticMarkup(React.createFactory(component.default)(data));
  }
  return string;
}

const renderToTemplate = function(componentString, componentName, data, stateful) {  
  const template = stateful ? 'templates/component.single.html' : 'templates/component.single.stateless.html';
  const templateComponent = fs.readFileSync(path.resolve(__dirname, template), 'utf8'); 

  // relace template placeholders
  let output = componentString;
  output = templateComponent.replace(/{{COMPONENT}}/g, output);
  if (stateful) {
    output = output.replace(/{{COMPONENT_NAME}}/g, componentName);
    output = output.replace(/{{COMPONENT_DATA}}/g, JSON.stringify(data));
  }
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

    // filepath for rendered component
    const outputFile = `${compiler.options.output.path}/${compiler.options.output.filename}`;

    // get component name
    const componentName = path.basename(options.entry, path.extname(options.entry));
    const componentNameData = getComponentName(options.entry);    

    // get data
    let data = getData(options.entry, componentName);
    const statefulGlobal = data['$stateful'] ? data['$stateful'] : true;
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

    // get component string    
    let output = '';
    for (let i in data) {
      let componentData = data[i]['$data'] ? data[i]['$data'] : data[i];
      let statefulLocal = statefulGlobal;
      if (data[i].hasOwnProperty('$stateful')) {
        statefulLocal = data[i]['$stateful'];
        delete(data[i]['$stateful']);
      }
      let outputComponent = renderToString(outputFile, componentData, statefulLocal);
      outputComponent = renderToTemplate(outputComponent, componentNameData, componentData, statefulLocal);
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
