import React from 'react';
import ReactDOM from 'react-dom';
import styled from '../lib/styler';
import reactHexagon from './assets/react-hexagon.png';
import Heading from './components/atomic/atoms/Heading/Heading';
import Paragraph from './components/atomic/atoms/Paragraph/Paragraph';
import Block from './components/atomic/molecules/Block/Block';

const Index = () => {
  return (
    <React.Fragment>
      <Heading>Aiiight</Heading>
      <Paragraph>Was geht?</Paragraph>
      <Block />
      <div><img src={reactHexagon} width="50" height="50" /></div>
    </React.Fragment>
  );
};

ReactDOM.render(<Index />, document.getElementById('index'));