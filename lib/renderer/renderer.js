import React from 'react';
import ReactDOMServer from 'react-dom/server';
import reactHexagon from '../../src/assets/react-hexagon.png';

const Index = () => {
  return <div>Hello React! <img src={reactHexagon} /></div>;
};

const output = ReactDOMServer.renderToString(<Index />);

console.log(output);