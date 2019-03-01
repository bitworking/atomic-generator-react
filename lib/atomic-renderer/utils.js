const React = require('react');
const ReactDOMServer = require('react-dom/server');
const pretty = require('pretty');
const fs = require('./fs');
const render = require('./render');
const templateComponentSingleStateless = require('./templates/component.single.stateless');
const templateComponentSingle = require('./templates/component.single');


const renderToString = (compiledPath, data, stateful) => {
  delete require.cache[require.resolve(compiledPath)];
  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  const component = require(compiledPath);
  let string = '';
  
  if (component.default) {
    if (stateful) {
      string = ReactDOMServer.renderToString(React.createFactory(component.default)(data));
    } else {
      string = ReactDOMServer.renderToStaticMarkup(React.createFactory(component.default)(data));
    }
  }

  return string;
};

const renderToTemplate = (componentString, componentName, componentProps, stateful) => {
  const templateFunction = stateful ? templateComponentSingle : templateComponentSingleStateless;
  return templateFunction(
    componentString, componentName, JSON.stringify(componentProps),
  );
};

const beautify = html => pretty(html);

const getOutPath = (outPath, componentName, index) => `${outPath}/${getComponentPath(componentName, index)}`;
const getComponentPath = (componentName, index) => `${componentName}-${index}.html`;
const getOutPathIFrame = (outPath, componentName, index) => `${outPath}/${getComponentPathIFrame(componentName, index)}`;
const getComponentPathIFrame = (componentName, index) => `${componentName}-${index}-component.html`;
const getLabel = (config) => config.label ? config.label : 'default';
const getUid = () => 'XXXXX'.replace(/[x]/gi, () => { return Math.random().toString(26)[5]; });
const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item));
const isArray = (item) => Array.isArray(item);

const mergeDeep = (target, source) => {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, {[key]: source[key]});
        }
        else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      }
      else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

module.exports = {
  renderToString,
  renderToTemplate,
  beautify,
  getOutPath,
  getComponentPath,
  getOutPathIFrame,
  getComponentPathIFrame,
  getLabel,
  getUid,
  isObject,
  isArray,
  mergeDeep,
};
