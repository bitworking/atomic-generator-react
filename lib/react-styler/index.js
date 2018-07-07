import React from 'react';
const e = React.createElement;

const func = (tag, className) => {
  return (props) => {
    const classes = props.className ? className +' '+ props.className : className;
    return e(tag, Object.assign({}, props, {className: classes}));
  };
};

const styled = tag => className => randomHash => {
  return func(tag, className);
}

export default styled;