import React from 'react';
import ReactDOM from 'react-dom';
import styled from '../lib/styler';
import reactHexagon from './assets/react-hexagon.png';
import Heading from './components/atomic/atoms/Heading/Heading';

const Paragraph = styled.p`
  color: red;
`;

const Container = styled.div`
  background: #ddd;
  font-size: 16px;
  ${Heading} {
    font-size: 24px;
  }
  ${Paragraph} {
    color: blue;
  }
`;

const Index = () => {
  return (
    <React.Fragment>
      <Heading>Aiiight</Heading>
      <Paragraph>Was geht?</Paragraph>
      <Container>
        <Heading>Und jetzt?</Heading>
        <Paragraph>Aiiiiight</Paragraph>
      </Container>
      <div><img src={reactHexagon} width="50" height="50" /></div>
    </React.Fragment>
  );
};

ReactDOM.render(<Index />, document.getElementById('index'));