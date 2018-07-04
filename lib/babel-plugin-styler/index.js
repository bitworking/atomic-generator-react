const resolve = require('path').resolve;
const fs = require('fs');

let components = {};
let identifiers = {};
let opts = {};

const getClassName = function(fileName, id) {  
  let pathArray = fileName.replace('.js', '').split('/');
  let componentsIndex = pathArray.lastIndexOf('src');
  pathArray = pathArray.slice(componentsIndex + 1);
  let pathString = pathArray.join('-') + '-' + id;
  return pathString.replace('components-atomic-', '').toLowerCase();
}

const getHash = function(fileName, id) { 
  let hash = 5381;
  fileName = fileName.replace('.js', '');
  const str = resolve('./src', fileName) + '_' + id;
  let i = str.length;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

const getIdentifierHash = function(identifier) {
  return identifiers[identifier] ? identifiers[identifier] : 'null';
}

const replaceCssPlaceholders = function() {
  for (var component1 in components) {
    if (!components.hasOwnProperty(component1)) continue;  
    let css = components[component1].css;
    for (var component2 in components) {
      css = css.replace('{{' + components[component2].hash + '}}', '.' + components[component2].className);
    }
    components[component1].css = css;
  }
}

const getAllCss = function() {
  let css = '';
  for (var component in components) {
    css += '.' + components[component].className + ' {';
    css += components[component].css;
    css += '}\n';
  }
  return css;
}

module.exports = function(babel) {
  const t = babel.types;

  return {
    pre(state) {
      identifiers = {};
      
    },
    visitor: {      
      ImportDeclaration(path) {
        path.node.specifiers.map(function(specifier) {
          identifiers[specifier.local.name] = getHash(path.node.source.value, specifier.local.name);
        });
      },
      VariableDeclaration(path, state) {        
        path.node.declarations.map(function(declaration) {
          if (declaration.init.type === 'TaggedTemplateExpression' && declaration.init.tag.object.name === 'styled') {
            identifiers[declaration.id.name] = getHash(state.file.opts.filename, declaration.id.name);
          }
        });
      },
      TaggedTemplateExpression(path, state) {
        if (path.node.tag.object.name === 'styled') {
          const fileName = state.file.opts.filename;
          const id = path.container.id.name;
          const tag = path.node.tag.property.name;
          const className = getClassName(fileName, id);

          // get css
          let nodes = path.node.quasi.quasis.concat(path.node.quasi.expressions);
          nodes.sort((a, b) => a.start - b.start);
          let css = '';
          nodes.forEach(element => {
            if (element.type === 'TemplateElement') {
              css += element.value.cooked;
            }
            else if (element.type === 'Identifier') {
              css += '{{' + getIdentifierHash(element.name) + '}}';
            }
          });

          const hash = getHash(fileName, id);

          components[hash] = {
            id: id,
            tag: tag,
            className: className,
            css: css,
            hash: hash
          };

          opts = state.opts;
        }
      },      
    },
    post(state) {
      if (!Object.keys(components).length) {
        return;
      }

      replaceCssPlaceholders();
      //console.log('components', components);
      //console.log('identifiers', identifiers);

      const css = getAllCss();

      const cssPath = opts.cssPath || './styler.dist.scss';

      fs.writeFileSync(cssPath, css);

    }
  };
}
