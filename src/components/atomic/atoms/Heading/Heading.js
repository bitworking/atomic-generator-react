// @flow
import * as React from 'react';
import styled from '../../../../../lib/react-styler';

export const H1 = styled.h1`
  font-family: sans-serif;
  margin: 0;
  font-size: 42px;  
`;

export const H2 = styled.h2`
  font-family: sans-serif;
  margin: 0;
  font-size: 30px;  
`;

export const H3 = styled.h3`
  font-family: sans-serif;
  margin: 0;
  font-size: 22px;  
`;

type Props = {
  tag: 'h1' | 'h2' | 'h3',
  children: any,
}

export default ({ tag, children }: Props): React.Node => (
  <React.Fragment>
    {tag === 'h1' && (
    <H1>
      {children}
    </H1>
    )}
    {tag === 'h2' && (
    <H2>
      {children}
    </H2>
    )}
    {tag === 'h3' && (
    <H3>
      {children}
    </H3>
    )}
  </React.Fragment>
);
