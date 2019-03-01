const utils = require('./utils');

const getNavigationFromJson = (atomicJsonArray) => {
  let naviObject = {};
  atomicJsonArray.forEach((atomicJson) => {
    naviObject = utils.mergeDeep(naviObject, getNaviObject(atomicJson));
  });
  return naviObject;
};

const getNaviObject = (atomicJson) => {
  if (!atomicJson.path) {
    return {};
  }
  const nested = {};
  const pathArray = atomicJson.path.split('/').reduce(
    (acc, value, index, arr) => {
      if (index < arr.length - 1) {
        return acc[value] = {};
      }
      return acc[value] = getLinkObjects(atomicJson);
    },
    nested,
  );
  return nested;
};

const getLinkObjects = (atomicJson) => {
  const links = [];
  atomicJson.configs.forEach((config, index) => {
    links.push(getLinkObject(atomicJson, index));
  });
  return links;
};

const getLinkObject = (atomicJson, configIndex) => {
  return {
    href: utils.getComponentPath(atomicJson.name, configIndex),
    label: utils.getLabel(atomicJson.configs[configIndex]),
  }
};

const buildHtmlLinks = (links, activeHref) => {
  let html = '<ul>';
  links.forEach((link) => {
    html += `<li class="${link.href === activeHref ? 'active' : ''}"><a href="${link.href}">${link.label}</a></li>`;
  });
  html += '</ul>';
  return html
};

const buildHtmlNavi = (naviObject, activeHref, isChild = false) => {
  let html = `<ul ${!isChild && 'class="list-tree"'}>`;
  Object.keys(naviObject).forEach((key) => {
    html += `<li class="tree-directory">${key}`;
    if (utils.isObject(naviObject[key])) {
      html += buildHtmlNavi(naviObject[key], activeHref, true);
    }
    else if (utils.isArray(naviObject[key])) {
      html += buildHtmlLinks(naviObject[key], activeHref, true);
    }
    html += '</li>';
  });

  html += '</ul>';
  return html;
};

module.exports = {
  getNavigationFromJson,
  buildHtmlNavi,
};
