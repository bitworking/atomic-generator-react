/* eslint-disable */
const path = require('path');
const resolve = path.resolve;
const fs = require('fs');
const utils = require('./utils');

const defaultScssPath = './dist/scss/main.scss';
let scssPath = defaultScssPath;

const setIdentifier = function(currentFile, fileName, id, path) {
  const hash = utils.getHash(currentFile, fileName, id);
  if (path.type === 'TaggedTemplateExpression') {
    const props = utils.isStyledAndReturnProps(path.tag);
    if (props) {
      if (props.isGlobal) {
        utils.addGlobalStyles(path);
      }
      else {        
        utils.setIdentifier(
          id,
          {
            hash,
            value: utils.extractTextFromTemplateLiteral(path.quasi),
            isTemplateLiteral: true,
            isStyled: true,
            className: utils.getClassName(currentFile, id),
            hasExp: path.quasi.expressions.length ? 1 : 0
          }
        );
      }
    }
  }
  else if (path.type === 'TemplateLiteral') {
    utils.setIdentifier(
      id,
      {
        hash,
        value: utils.extractTextFromTemplateLiteral(path),
        isTemplateLiteral: true,
        hasExp: path.expressions.length ? 1 : 0
      }
    );
  }
  else if (path.type === 'StringLiteral') {
    utils.setIdentifier(id, {hash, value: path.value});
  }
  else if (path.type === 'NumericLiteral') {
    utils.setIdentifier(id, {hash, value: path.value});
  }
}

module.exports = function(babel) {
  const t = babel.types;

  return {
    pre(state) {
      utils.clearIdentifiers();
    },
    visitor: {
      Program(path, { file, opts }) {
        scssPath = opts.scssPath || defaultScssPath;
        scssPath = resolve(scssPath);
        // file.addImport(scssPath, '');
      },
      ImportDeclaration(path, state) {
        path.node.specifiers.map(function(specifier) {
          const hash = utils.getHash(state.file.opts.filename, path.node.source.value, specifier.local.name);
          utils.setIdentifier(specifier.local.name, {hash});
        });
      },
      VariableDeclaration(path, state) {
        path.node.declarations.map(function(declaration) {
          if (declaration.init) {
            setIdentifier(state.file.opts.filename, state.file.opts.filename, declaration.id.name, declaration.init);
          }
        });
      },
      ExportDefaultDeclaration(path, state) {
        const fileName = state.file.opts.filename;
        const id = path.node.declaration.left ? path.node.declaration.left.name : utils.getJsFileName(fileName);
        const objectPath = path.node.declaration.right ? path.node.declaration.right : path.node.declaration;
        setIdentifier(state.file.opts.filename, state.file.opts.filename, id, objectPath);
      },
      TaggedTemplateExpression(path, state) {
        const styledProps = utils.isStyledAndReturnProps(path.node.tag);
        if (styledProps === false) {
          return;
        }
        const fileName = state.file.opts.filename;
        const id = path.container.type === 'ExportDefaultDeclaration' ? utils.getJsFileName(fileName) : path.container.id.name;
        const className = utils.getClassName(fileName, id);
        path.replaceWithSourceString(`styled('${styledProps.tag}')('${className}')(\`${Math.random().toString(36).substr(2, 5)}\`)`);
      }
    },
    post(state) {
      utils.replaceCssPlaceholders();
      utils.replaceCssPlaceholdersGlobalStyles();
      let css = utils.getGlobalStyles();
      css += utils.getAllCss();

      // test vor invalid css
      const regex = /{{(.*?)}}/g;
      if (regex.test(css)) {
        css = '';
      }

      try {
        utils.createDir(scssPath);
        fs.writeFileSync(scssPath, css);
      }
      catch(e) {
        console.error('Could not write styler scss file', e);
      }
      
    }
  };
}
