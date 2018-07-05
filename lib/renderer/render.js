const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const options = require('./webpack.config');
const { execFile } = require('child_process');

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const fs = new MemoryFS();

options.entry = './src/components/atomic/molecules/Block/Block.js';

const compiler = webpack(options);

//compiler.outputFileSystem = fs;
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
    data: ''
  }));

  console.log(output);

  
});