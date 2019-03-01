/* eslint-disable */
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const webpackConfig = require('./webpack.config');
const render = require('./render');
const utils = require('./utils');
const navi = require('./navi');
const fs = require('./fs');

const writeComponentHtml = async (outPath, componentPath, componentName, config, index, templateFunction, navigationHtml) => {
  const name = utils.getLabel(config);
  const outputPath = utils.getOutPath(outPath, componentName, index);
  const outputPathIFrame = utils.getOutPathIFrame(outPath, componentName, index);
  const outputPathIFrameBasename = path.basename(outputPathIFrame);

  const props = config.props || {};
  const stateful = config.stateful || false;

  try {
    // component to string
    const componentString = await render.componentString(
      componentPath,
      props,
      webpackConfig,
      stateful,
    );

    // render component template
    const componentTemplate = render.componentTemplate(
      componentString,
      componentName,
      props,
      stateful,
    );

    // write component template
    const mainTemplate = render.mainTemplate(outputPathIFrameBasename, utils.beautify(componentTemplate), navigationHtml);
    fs.writeFile(outputPath, mainTemplate);

    const componentTemplateIFrame = templateFunction(componentTemplate);
    fs.writeFile(outputPathIFrame, componentTemplateIFrame);
    
  }
  catch(error) {
    console.error(error);
  }
};

const writeAllComponentHtml = (output, template, atomicJson, templateFunction, navigationHtml) => {
  // components in subfolders
  // const outPath = `${output}/${atomicJson.name}`;
  const outPath = output;

  atomicJson.configs.forEach((config, index) => {
    writeComponentHtml(
      outPath,
       `${atomicJson.folder}/${atomicJson.component}`,
      atomicJson.name,
      config,
      index,
      templateFunction,
      navigationHtml,
    );
  });
};

const main = () => {
  const entry = argv.entry;
  const output = argv.output;
  const template = argv.template;

  if (!entry) {
    console.log('An "entry" argument has to be provided!');
    return;
  }

  if (!output) {
    console.log('An "output" argument has to be provided!');
    return;
  }

  if (!template) {
    console.warn('Warning: No "template" argument provided.');
  }

  // remove compiled files
  fs.removeFiles(webpackConfig.output.path);

  const atomicJsonArray = fs.getAtomicJsonArray(entry);
  const navigationObject = navi.getNavigationFromJson(atomicJsonArray);
  const navigationHtml = navi.buildHtmlNavi(navigationObject, '');

  const templateFunction = template ? require(path.join(process.cwd(), template)) : (component) => component;

  for (const i in atomicJsonArray) {
    writeAllComponentHtml(output, template, atomicJsonArray[i], templateFunction, navigationHtml);
  }

};

module.exports = main;
