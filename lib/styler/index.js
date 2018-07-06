import React from 'react';
const e = React.createElement;

const func = (tag, className) => {
  return (props) => {
    return e(tag, Object.assign({className}, props));
  };
};

const styled = tag => className => randomHash => {
  return func(tag, className);
}

export default styled;