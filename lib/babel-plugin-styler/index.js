
const getClassName = function(fileName, id) {  
  let pathArray = fileName.replace('.js', '').split('/');
  let componentsIndex = pathArray.lastIndexOf('src');
  pathArray = pathArray.slice(componentsIndex + 1);
  let pathString = pathArray.join('-') + '-' + id;
  return pathString.replace('components-atomic-', '').toLowerCase();
}

let components = [];

module.exports = function(babel) {
  const t = babel.types;

  const ast = {
    visitor: {
      TaggedTemplateExpression(path, state) {
        if (path.node.tag.object.name === 'styled') {
          const filename = state.file.opts.filename;
          const id = path.container.id.name;
          const tag = path.node.tag.property.name;
          const className = getClassName(filename, id);

          // get css
          let nodes = path.node.quasi.quasis.concat(path.node.quasi.expressions);
          nodes.sort((a, b) => a.start - b.start);
          let css = '';
          nodes.forEach(element => {
            if (element.type === 'TemplateElement') {
              css += element.value.cooked;
            }
            else if (element.type === 'Identifier') {
              css += '{{' + element.name + '}}';
            }
          });

          components[id] = {id: id, tag: tag, className: className, css: css};
          console.log('components', components);
        }
      },      
    }
  };

  console.log('components', components);

  return ast;

}