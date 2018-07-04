import React from 'react';
import ReactDOM from 'react-dom';
import styled from '../lib/styler';
import reactHexagon from './assets/react-hexagon.png';

import Heading from './components/atomic/atoms/Heading/Heading';

const Container = styled.div`
  background: #333;
  font-size: 16px;
  ${Heading} {
    font-size: 24px;
  }
`;

const Index = () => {
  return (
    <React.Fragment>
      <div children={'Outside Container.'} />
      <div><h2>Inside Container.</h2>Hello React! <img src={reactHexagon} /></div>
    </React.Fragment>
  );
};

ReactDOM.render(<Index />, document.getElementById('index'));