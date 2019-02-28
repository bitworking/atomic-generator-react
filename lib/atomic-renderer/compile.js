const fs = require('fs');
const path = require('path');
/* eslint-disable-next-line */
const webpack = require('webpack');
const utils = require('./utils');

/**
 * 
 * 
 * @param {*} componentData 
 * @param {*} distFolder 
 * @param {*} options 
 */
const compile = (componentData, distFolder, options) => {
  const componentFile = componentData.file;
  const compiler = webpack({ ...options, entry: componentFile });

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
    const componentName = path.basename(componentFile, path.extname(componentFile));
    const componentNameData = utils.getComponentName(componentFile);

    // get json
    const componentJson = utils.getData(componentFile, componentName);
    const statefulGlobal = componentJson.stateful ? componentJson.stateful : false;

    // get config from json
    let configs = [componentJson];
    if (componentJson.config) {
      if (!Array.isArray(componentJson.config)) {
        configs = [componentJson.config];
      } else {
        ({ config: configs } = componentJson);
      }
    }

    // get component string
    /* eslint-disable */
    /*
    let output = '';
    for (let i in configs) {
      let componentData = configs[i]['props'] ? configs[i]['props'] : configs[i];
      let statefulLocal = statefulGlobal;
      if (configs[i].hasOwnProperty('stateful')) {
        statefulLocal = configs[i]['stateful'];
        delete(configs[i]['stateful']);
      }
      let outputComponent = utils.renderToString(outputFile, componentData, statefulLocal);
      outputComponent = utils.renderToTemplate(
        outputComponent, componentNameData, componentData, statefulLocal,
      );
      output += outputComponent;
    }
    */
    /* eslint-enable */

    let output = '';
    configs.forEach((config) => {
      const componentProps = config.props ? config.props : config;
      // const statefulLocal = config.stateful ? config.stateful : statefulGlobal;
      let statefulLocal = statefulGlobal;
      if (config.hasOwnProperty('stateful')) {
        statefulLocal = config['stateful'];
        delete(config['stateful']);
      }

      // console.log(outputFile, componentProps, statefulLocal);

      let outputComponent = utils.renderToString(outputFile, componentProps, statefulLocal);
      outputComponent = utils.renderToTemplate(
        outputComponent, componentNameData, componentProps, statefulLocal,
      );
      output += outputComponent;
    });

    console.log({ ...options, entry: componentFile });
    console.log(outputFile, output);

    // render into main template
    /* eslint-disable-next-line import/no-dynamic-require, global-require */
    output = require(path.resolve(__dirname, 'templates/component'))(componentName, output);

    // write file
    const distPath = `${distFolder}/${componentData.folderObject.name}/${componentName}/${componentName}.html`;

    utils.createDir(distPath);
    fs.writeFileSync(distPath, output);
    fs.unlinkSync(outputFile);
  });
};

const compileAll = (componentsData, distFolder, webpackConfig) => {
  for (let i = 0; i < componentsData.length; i += 1) {
    compile(componentsData[i], distFolder, webpackConfig);
  }
};

module.exports = (componentsData, distFolder, webpackConfig) => {
  compileAll(componentsData, distFolder, webpackConfig);
};
