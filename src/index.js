import React from 'react';
import ReactDOM from 'react-dom';

// import components
import Heading from './components/atomic/atoms/Heading/Heading';
import Paragraph from './components/atomic/atoms/Paragraph/Paragraph';
import ButtonSwitch from './components/atomic/atoms/ButtonSwitch/ButtonSwitch';
import Block from './components/atomic/molecules/Block/Block';

const componentRegistry = {
  'Heading': Heading,
  'Paragraph': Paragraph,
  'ButtonSwitch': ButtonSwitch,
  'Block': Block
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
