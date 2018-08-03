import React from 'react';
import ReactDOM from 'react-dom';
import Playground from './components/playground/playground';

import './main.scss';

let container = document.getElementById('index');

ReactDOM.render(React.createElement(Playground), container);