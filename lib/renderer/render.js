const MemoryFS = require('memory-fs');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const options = require('./webpack.config');

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const distFolder = './dist/atomic';
const componentsFolder = './src/components/atomic';
const componentPath = 'molecules/Block/Block.js';

const createDir = function(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createDir(dirname);
  fs.mkdirSync(dirname);
}

const compile = function(componentsFolder, componentPath, distFolder, options) {
  options.entry = componentsFolder + '/' + componentPath;
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

    const outputFile = `${compiler.options.output.path}/${compiler.options.output.filename}`;
    let component = require(outputFile);
    
    let output = ReactDOMServer.renderToString(React.createFactory(component.default)({
      heading: 'Das ist die Überschrift',
      paragraph: 'Das ist der Paragraph'
    }));

    console.log(output);

    const distPath = distFolder + '/' + componentPath;

    createDir(distPath);
    fs.writeFileSync(distPath, output);

  });
}

compile(componentsFolder, componentPath, distFolder, options);