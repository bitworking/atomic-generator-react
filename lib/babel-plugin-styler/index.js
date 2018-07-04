const path = require('path');
const resolve = path.resolve;
const fs = require('fs');

let components = [];
let identifiers = {};
let opts = {};
const defaultCssPath = './dist/assets/main.scss';

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
  for (var i in components) {
    let css = components[i].css;
    for (var j in components) {
      css = css.replace('{{' + components[j].hash + '}}', '.' + components[j].className);
    }
    components[i].css = css;
  }
}

const getAllCss = function() {
  let componentsCopy = components;
  componentsCopy.sort(function(a, b) {
    return a.hasExp - b.hasExp;
  });

  let css = '';
  for (var i in componentsCopy) {
    css += '.' + componentsCopy[i].className + ' {';
    css += componentsCopy[i].css;
    css += '}\n';
  }
  return css;
}

const createDir = function(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createDir(dirname);
  fs.mkdirSync(dirname);
}

const componentExists = function(hash) {
  for (var i in components) {
    if (components[i].hash === hash) {
      return true;
    }
  }
  return false;
}

function normalizeOptions(options = []) {
  if (isPlainObject(options)) {
      return [];
  }
  const normalized = Array.isArray(options) ? options : [options];
  return normalized.filter(Boolean).reverse();
}

module.exports = function(babel) {
  const t = babel.types;

  return {
    pre(state) {
      identifiers = {};
      
    },
    visitor: {
      Program(path, { file, opts }) {
        let cssPath = opts.cssPath || defaultCssPath;
        cssPath = resolve(cssPath);
        file.addImport(cssPath, '');
      },
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

          if (!componentExists(hash)) {
            components.push({
              id: id,
              tag: tag,
              className: className,
              css: css,
              hash: hash,
              hasExp: path.node.quasi.expressions.length ? 1 : 0
            });
          }

          opts = state.opts;
        }
      },      
    },
    post(state) {
      if (!components.length) {
        return;
      }

      replaceCssPlaceholders();
      //console.log('components', components);
      //console.log('identifiers', identifiers);

      const css = getAllCss();

      const cssPath = opts.cssPath || defaultCssPath;

      try {
        createDir(cssPath);
        fs.writeFileSync(cssPath, css);
      }
      catch(e) {

      }

    }
  };
}
