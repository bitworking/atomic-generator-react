const utils = require('./utils');

const getNavigationFromJson = (atomicJsonArray) => {
  const naviTree = [];
  //const json = utils.readJsonFile(jsonFiles);
  const naviObject = getNaviObject(atomicJsonArray[0]);
  console.log(naviObject);
};

const getNaviObject = (atomicJson) => {
  if (!atomicJson.path) {
    return {};
  }
  const nested = {};
  const pathArray = atomicJson.path.split('/').reduce(
    (acc, value, index, arr) => {
      /*
      if (index < arr.length - 1) {
        return acc[value] = {};
      }
      */
      // return acc[value] = values2.items[i].items[j].value;
      return acc[value] = {};
    },
    nested,
  );
  return nested;
}

module.exports = {
  getNavigationFromJson,
};
