/* eslint-disable */
const path = require('path');
const resolve = path.resolve;
const fs = require('fs');
const utils = require('./utils');

test("getClassName('C:\\stuff\\atomic-generator-react\\src\\components\\atomic\\atoms\\Heading\\Heading.js', 'Heading')", () => {
  expect(utils.getClassName('C:\\stuff\\atomic-generator-react\\src\\components\\atomic\\atoms\\Heading\\Heading.js', 'Heading')).toBe('atoms-heading');
});

test("getClassName('src/components/atomic/atoms/Heading/Heading.js', 'Heading')", () => {
  expect(utils.getClassName('src/components/atomic/atoms/Heading/Heading.js', 'Heading')).toBe('atoms-heading');
});
