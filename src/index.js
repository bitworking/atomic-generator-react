import React from 'react';
import ReactDOM from 'react-dom';

// import scss
// import '../dist/assets/scss/main.scss';

// import components
import Heading from './components/atomic/atoms/Heading/Heading';
import Paragraph from './components/atomic/atoms/Paragraph/Paragraph';
import ButtonSwitch from './components/atomic/atoms/ButtonSwitch/ButtonSwitch';
import Block from './components/atomic/molecules/Block/Block';

const componentRegistry = {
  'atoms-heading': Heading,
  'atoms-paragraph': Paragraph,
  'atoms-buttonswitch': ButtonSwitch,
  'molecules-block': Block
};

const reactComponents = document.querySelectorAll('[data-reactcomponent]');

for(var i in reactComponents) {
  if (!reactComponents.hasOwnProperty(i)) {
    continue;
  }

  const container = reactComponents[i];
  const component = componentRegistry[container.dataset['reactcomponent']];
  const props = container.dataset['reactdata'] ? JSON.parse(container.dataset['reactdata']) : {};

  if (component) {
    ReactDOM.hydrate(
      React.createElement(
        component,
        props
      ),
      container
    );
  }
}
