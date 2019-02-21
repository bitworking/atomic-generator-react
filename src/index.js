import React from 'react';
import ReactDOM from 'react-dom';

// import scss
import './main.scss';

// import components
import componentRegistry from './componentRegistry';

const reactComponents = document.querySelectorAll('[data-reactcomponent]');

for(var i in reactComponents) {
  if (!reactComponents.hasOwnProperty(i)) {
    continue;
  }

  const container = reactComponents[i];
  const component = componentRegistry[container.dataset['reactcomponent']];
  const props = container.dataset['reactprops'] ? JSON.parse(container.dataset['reactprops']) : {};

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
