import * as React from 'react';

const func = (tag: string, className: string) => React.forwardRef((props, ref) => {
  const { className: propsClassName = null } = props;
  const classes = propsClassName ? `${className} ${propsClassName}` : className;
  return React.createElement(tag, { ...props, ref, className: classes });
});

const styled = tag => className => randomHash => func(tag, className);

export default styled;
