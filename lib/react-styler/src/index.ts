import * as React from 'react';

const func = (tag: string, className: string) => (props) => {
  const { className: propsClassName = null } = props;
  const classes = propsClassName ? `${className} ${propsClassName}` : className;
  return React.createElement(tag, { ...props, className: classes });
};

const styled = tag => className => randomHash => func(tag, className);

export default styled;
