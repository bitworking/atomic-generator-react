// @flow
import * as React from 'react';

type PropType = {
  children: React.Node,
  name: string,
  props: any,
};

export default ({ children, name, props }: PropType): React.Node => (
  <div data-reactcomponent={name} data-reactprops={JSON.stringify(props)}>
    <children.type { ...children.props } data-reactroot="" />
  </div>
);
