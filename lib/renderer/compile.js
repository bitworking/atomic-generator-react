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

const compileNext = function(distFolder, options) {
  if (index < componentsData.length) {
    compile(componentsData[index], distFolder, options);
  }
}

const compile = function(componentData, distFolder, options) {
  options.entry = componentData.file;
  const compiler = webpack(options);

  // use memory filesystem (can't require from memory, require-from-string would be a solution)
  // const fs = new MemoryFS();
  // compiler.outputFileSystem = fs;

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    if (stats.hasErrors()) {
      console.error(stats.toJson().errors);
      return;
    }

    // require renderer component
    const outputFile = `${compiler.options.output.path}/${compiler.options.output.filename}`;
    delete require.cache[require.resolve(outputFile)];
    const component = require(outputFile);

    const data = {"heading": "Das ist die Überschrift", "paragraph": "Das ist der Paragraph"};
    
    let output = ReactDOMServer.renderToString(React.createFactory(component.default)(data));

    console.log(output);

    // read index template into string
    const templateComponent = fs.readFileSync(path.resolve(__dirname, 'templates/component.html'), 'utf8');

    // get component name
    const componentName = path.basename(options.entry, path.extname(options.entry));

    // relace template placeholders
    output = templateComponent.replace(/{{COMPONENT}}/g, output);
    output = output.replace(/{{COMPONENT_NAME}}/g, componentName);
    output = output.replace(/{{COMPONENT_DATA}}/g, JSON.stringify(data));

    
    
    // write file
    /*
    let distPath = distFolder + '/' + componentPath;
    distPath = path.dirname(distPath);    
    distPath = distPath + '/' + componentName + '.html';
    */

    const distPath = distFolder +'/'+ componentData.folderObject.name +'/'+ componentName +'/'+ componentName +'.html';

    createDir(distPath);
    fs.writeFileSync(distPath, output);
    fs.unlinkSync(outputFile);

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