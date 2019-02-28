const utils = require('./utils');
const webpack = require('webpack');
const templateMain = require('./templates/main');

const componentString = (componentPath, componentProps, webpackConfigPath, isStateful) => {
  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  const webpackConfig = require(webpackConfigPath);
  const compiler = webpack({ ...webpackConfig, entry: componentPath });
  const outputFile = `${compiler.options.output.path}/${compiler.options.output.filename}`;
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(stats.toJson().errors);
      }

      resolve(utils.renderToString(outputFile, componentProps, isStateful));
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
};
