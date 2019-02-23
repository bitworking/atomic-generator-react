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

export const H4 = styled.h3`
  font-family: sans-serif;
  margin: 0;
  font-size: 22px;  
`;

export const H5 = styled.h3`
  font-family: sans-serif;
  margin: 0;
  font-size: 22px;  
`;

export const H6 = styled.h3`
  font-family: sans-serif;
  margin: 0;
  font-size: 22px;  
`;

type PropsType = {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  children: React.ReactNode
};

const headlines = {
  H1, H2, H3, H4, H5, H6,
};

export default ({ tag, children }: PropsType): React.Node => (
  <React.Fragment>
    {React.createElement(headlines[tag.toUpperCase()], {}, children)}
  </React.Fragment>
);
