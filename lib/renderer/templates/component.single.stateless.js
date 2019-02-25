const toDiffableHtml = require('diffable-html');

module.exports = component => `
${component}

<div class="atomic-pattern-lib component-raw-output">
  <h4>Code:</h4>
  <xmp>${toDiffableHtml(`${component}`)}</xmp>
</div>
`;
