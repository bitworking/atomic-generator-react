const path = require('path');
const resolve = path.resolve;
const fs = require('fs');

let components = [];
let identifiers = {};
let opts = {};
const defaultCssPath = './dist/scss/main.scss';
let cssPath = defaultCssPath;

const getClassName = function(fileName, id) {
  fileName = fileName.toLowerCase();
  let pathArray = fileName.replace('.js', '').split('/');
  pathArray.push(id.toLowerCase());
  pathArray = pathArray.filter(function(value, index, self) {return self.indexOf(value) === index;});
  let componentsIndex = pathArray.lastIndexOf('src');
  pathArray = pathArray.slice(componentsIndex + 1);
  let pathString = pathArray.join('-');
  return pathString.replace('components-atomic-', '');
}

const getJsFileName = function(fileName) {
  let pathArray = fileName.replace('.js', '').split('/');
  return pathArray[pathArray.length - 1];
}

const getHash = function(currentFile, fileName, id) { 
  let hash = 5381;
  fileName = fileName.replace('.js', '');
  const str = resolve(path.dirname(currentFile), fileName) + '_' + id;
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
  for (const i in components) {
    let css = components[i].css;
    for (const j in components) {
      // TODO: replace multiple hashes (regex g)
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
  for (const i in componentsCopy) {
    css += '.' + componentsCopy[i].className + ' {';
    css += componentsCopy[i].css;
    css += '}\n';
  }
  return css;
}

const extractCssFromExpression = function(path) {
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
  return css;
}

const createDir = function(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createDir(dirname);
  fs.mkdirSync(dirname);
}

const componentExists = function(hash) {
  for (const i in components) {
    if (components[i].hash === hash) {
      return i;
    }
  }
  return false;
}

const isStyledAndReturnProps = function(tag) {
  const styled = 'styled';
  // styled``
  if (tag.type === 'Identifier' && tag.name === styled) {
    return {type: 'Identifier', tag: 'div', className: null};
  }
  // styled.p``
  if (tag.type === 'MemberExpression' && tag.object.name === styled) {
    return {type: 'MemberExpression', tag: tag.property.name, className: null};
  }
  // styled('p')``
  if (tag.type === 'CallExpression' && tag.callee.type === 'Identifier' && tag.callee.name === styled) {
    return {type: 'CallExpression', tag: tag.arguments[0].value, className: null};
  }
  // styled('p')('classname')``
  if (tag.type === 'CallExpression' && tag.callee.type === 'CallExpression' && tag.callee.callee.name === styled) {
    return {type: 'CallExpression2', tag: tag.callee.arguments[0].value, className: tag.arguments[0].value};
  }
  return false;
}

module.exports = function(babel) {
  const t = babel.types;

  return {
    pre(state) {
      identifiers = {};
    },
    visitor: {
      Program(path, { file, opts }) {
        cssPath = opts.cssPath || defaultCssPath;
        cssPath = resolve(cssPath);
        file.addImport(cssPath, '');
      },
      ImportDeclaration(path, state) {
        path.node.specifiers.map(function(specifier) {
          identifiers[specifier.local.name] = getHash(state.file.opts.filename, path.node.source.value, specifier.local.name);
        });
      },
      VariableDeclaration(path, state) {        
        path.node.declarations.map(function(declaration) {
          if (declaration.init && declaration.init.type === 'TaggedTemplateExpression') {
            if (isStyledAndReturnProps(declaration.init.tag)) {
              identifiers[declaration.id.name] = getHash(state.file.opts.filename, state.file.opts.filename, declaration.id.name);
            }
          }
        });
      },
      TaggedTemplateExpression(path, state) {
        const styledProps = isStyledAndReturnProps(path.node.tag);
        if (styledProps === false) {
          return;
        }

        // save opts for post task
        opts = state.opts;
        
        // get className and hash
        const fileName = state.file.opts.filename;
        const id = path.container.type === 'ExportDefaultDeclaration' ? getJsFileName(fileName) : path.container.id.name;
        const className = getClassName(fileName, id);
        const hash = getHash(state.file.opts.filename, fileName, id);
  
        // only evaluates local vars
        // const evaluated = path.get('quasi').evaluate();
        // console.log('evaluated', fileName, evaluated.value);

        // get css
        css = extractCssFromExpression(path);
        
        console.log(css);

        // add component
        const component = {
          id: id,
          tag: styledProps.tag,
          className: className,
          css: css,
          hash: hash,
          hasExp: path.node.quasi.expressions.length ? 1 : 0
        };

        const componentIndex = componentExists(hash);
        if (componentIndex === false) {
          components.push(component);
        }
        else {
          components[componentIndex] = component;
        }
        
        path.replaceWithSourceString(`styled('${styledProps.tag}')('${className}')(\`${Math.random().toString(36).substr(2, 5)}\`)`);
      },      
    },
    post(state) {
      if (!components.length) {
        // if no styled component is in file scss file must be written nevertheless
        // else webpack trys to compile a non existent file
        // because scss import statement is added to every file
        // so no return here
        // return;
      }

      replaceCssPlaceholders();
      const css = getAllCss();

      try {
        createDir(cssPath);
        fs.writeFileSync(cssPath, css);
      }
      catch(e) {
        console.error('Could not write styler scss file');
      }
    }
  };
}
