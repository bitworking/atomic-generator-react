// @flow
import styled from 'react-styler';
import normalizeCss from './normalizeCss';


export default styled.global`
  ${normalizeCss}

  html {
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }
`;
