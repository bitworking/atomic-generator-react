import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import styled from '../lib/styler';
import reactHexagon from './assets/react-hexagon.png';

const Container = styled.div`
  background: #333;
`;

const Index = () => {
  return <div>Hello React! <img src={reactHexagon} /></div>;
};

const server = express();
server.use('/assets', express.static('assets'));

server.get('/', (req, res) => {
  res.send(ReactDOMServer.renderToString(<Index />));
});

server.listen(8080);
console.log('listening 8080');