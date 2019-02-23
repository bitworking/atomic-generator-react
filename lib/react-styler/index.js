import React from 'react';

const func = (tag, className) => (props) => {
  const { className: propsClassName = null } = props;
  const classes = propsClassName ? `${className} ${propsClassName}` : className;
  return React.createElement(tag, Object.assign({}, props, { className: classes }));
};

// eslint-disable-next-line
const styled = tag => className => randomHash => func(tag, className);

export default styled;
