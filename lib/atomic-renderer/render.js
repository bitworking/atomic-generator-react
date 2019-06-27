/* eslint-disable */
const utils = require('./utils');
const webpack = require('webpack');
const templateMain = require('./templates/main');

const componentString = (componentPath, componentProps, webpackConfig, isStateful) => {
  const outputFile = {
    path: webpackConfig.output.path,
    filename: `${utils.getUid()}-${webpackConfig.output.filename}`,
  };
  const compiler = webpack({
    ...webpackConfig,
    entry: componentPath,
    output: {
      ...webpackConfig.output,
      ...outputFile
    }
  });

  const compiledPath = `${compiler.options.output.path}/${compiler.options.output.filename}`;
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(stats.toJson().errors);
      }

      resolve(utils.renderToString(compiledPath, componentProps, isStateful));
    });
  });
};

const componentTemplate = (componentString, componentName, componentProps, isStateful) => {
  return utils.renderToTemplate(componentString, componentName, componentProps, isStateful);
};

const mainTemplate = (componentHtmlPath, componentString, navigationString) => {
  return templateMain(componentHtmlPath, componentString, navigationString);
};

module.exports = {
  componentString,
  componentTemplate,
  mainTemplate,
};
