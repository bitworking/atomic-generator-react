const utils = require('../utils');

module.exports = componentString => `
${utils.beautify(`${componentString}`)}
`;
