const beautify = require('../beautify');

module.exports = component => `
${component}

<div class="atomic-pattern-lib component-raw-output">
  <h4>Code:</h4>
  <xmp>${beautify(`${component}`)}</xmp>
</div>
`;
