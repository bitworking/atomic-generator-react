const utils = require('../utils');

module.exports = (componentString, componentName, componentProps) => `
${utils.beautify(`<div data-reactcomponent="${componentName}" data-reactprops='${componentProps}'>${componentString}</div>`)}
`;
