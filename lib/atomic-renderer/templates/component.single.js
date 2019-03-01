module.exports = (componentString, componentName, componentProps) => `
<div data-reactcomponent="${componentName}" data-reactprops='${componentProps}'>${componentString}</div>
`;
