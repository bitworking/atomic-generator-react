const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const options = require('./webpack.config');
const { execFile } = require('child_process');

const fs = new MemoryFS();
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
  //console.log(outputFile);
  
  const child = execFile('node', [outputFile], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });
  
});