// @flow
import * as React from 'react';
import styled from 'react-styler';

const font = `
  font-family: serif;
  font-weight: bold;
  margin: 0;
  margin-bottom: 1rem;
  line-height: normal;
`;

export const H1 = styled.h1`
  ${font}
  font-size: 3.6rem;
`;

export const H2 = styled.h2`
  ${font}
  font-size: 2.8rem;
`;

export const H3 = styled.h3`
  ${font}
  font-size: 2.4rem;
`;

export const H4 = styled.h4`
  ${font}
  font-size: 2rem;
`;

export const H5 = styled.h5`
  ${font}
  font-size: 1.7rem;
`;

export const H6 = styled.h6`
  ${font}
  font-size: 1.4rem;
`;

type PropsType = {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  children: React.Node
};

const headlines = {
  H1, H2, H3, H4, H5, H6,
};

export default ({ tag, children }: PropsType): React.Node => (
  <React.Fragment>
    {React.createElement(headlines[tag.toUpperCase()], {}, children)}
  </React.Fragment>
);
