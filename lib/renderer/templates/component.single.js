module.exports = (component, componentName, componentData) => `
<div data-reactcomponent="${componentName}" data-reactprops='${componentData}'>${component}</div>

<div class="atomic-pattern-lib component-raw-output">
  <h4>Code:</h4>
  <xmp><div data-reactcomponent="${componentName}" data-reactprops='${componentData}'>${component}</div></xmp>
</div>
`;
