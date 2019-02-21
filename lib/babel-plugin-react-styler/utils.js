/* eslint-disable */
const path = require('path');
const resolve = path.resolve;
const fs = require('fs');

let identifiers = {};
let identifiersGlobal = {};

const getClassName = function(fileName, id) {
  fileName = fileName.replace(/\\/g, '/');
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
  fileName = fileName.replace(/\\/g, '/');
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

const setIdentifier = function(key, value) {
  identifiers[key] = value;
  if (!identifiersGlobal[value.hash]) {
    identifiersGlobal[value.hash] = value;
  }
  else {
    identifiersGlobal[value.hash] = Object.assign(identifiersGlobal[value.hash], value);
  }
}

const clearIdentifiers = function() {
  identifiers = {};
}

const getIdentifiers = function() {
  return identifiers;
}

const getIdentifiersGlobal = function() {
  return identifiersGlobal;
}

const getIdentifierHash = function(identifier) {
  return identifiers[identifier] ? identifiers[identifier].hash : null;
}

const getHashesFromString = function(string) {
  let found = [];
  const regex = /{{(.*?)}}/g;
  let mat;
  while(mat = regex.exec(string)) {
    found.push(mat[1]);
  }
  return found;
}

const getValueFromGlobalIdentifier = function(hash) {
  if (identifiersGlobal[hash]) {
    if (identifiersGlobal[hash].isStyled) {
      return '.' + identifiersGlobal[hash].className;
    }
    if (identifiersGlobal[hash].value) {
      return identifiersGlobal[hash].value;
    }
  }
  return null;
}

const replaceCssPlaceholders = function() {
  for (let key in identifiersGlobal) {
    if (!identifiersGlobal.hasOwnProperty(key)) continue;
    if (!identifiersGlobal[key].isTemplateLiteral) continue;
    if (!identifiersGlobal[key].hasExp) continue;
    let hashes = getHashesFromString(identifiersGlobal[key].value);
    let result = identifiersGlobal[key].value;
    for (let i=0; i<hashes.length; i++) {
      let hash = hashes[i];
      let value = getValueFromGlobalIdentifier(hash);
      if (value !== null) {
        let re = new RegExp('{{(' + hash + ')}}', 'g');
        result = result.replace(re, value);
      }
    }
    identifiersGlobal[key].value = result;
  }
}

const getAllCss = function() {
  let components = Object.values(identifiersGlobal);
  const componentsCopy = components.filter(function(component) {
    if (component.isStyled) {
      return true;
    }
    return false;
  });
  componentsCopy.sort(function(a, b) {
    return a.hasExp - b.hasExp;
  });

  let css = '';
  for (const i in componentsCopy) {
    css += '.' + componentsCopy[i].className + ' {';
    css += componentsCopy[i].value;
    css += '}\n';
  }
  return css;
}

const extractTextFromTemplateLiteral = function(path) {
  let nodes = path.quasis.concat(path.expressions);
  nodes.sort((a, b) => a.start - b.start);
  let css = '';
  nodes.forEach(element => {
    if (element.type === 'TemplateElement') {
      css += element.value.cooked;
    }
    else if (element.type === 'Identifier') {
      let hash = getIdentifierHash(element.name);
      if (hash !== null) {
        css += '{{' + hash + '}}';
      }
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

module.exports = {
  getClassName,
  getJsFileName,
  getHash,
  setIdentifier,
  clearIdentifiers,
  getIdentifiers,
  getIdentifiersGlobal,
  getIdentifierHash,
  replaceCssPlaceholders,
  getAllCss,
  extractTextFromTemplateLiteral,
  createDir,
  componentExists,
  isStyledAndReturnProps
}
