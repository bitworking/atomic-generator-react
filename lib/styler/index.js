import React from 'react';
const e = React.createElement;

const func = (tag, className) => {
  return ({children}) => {
    return e(tag, {className}, children);
  };
};

const styled = tag => className => {
  return func(tag, className);
}

export default styled;