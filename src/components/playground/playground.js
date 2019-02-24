import React from 'react';
import Paragraph from '../atomic/atoms/Paragraph/Paragraph';
import Block from '../atomic/molecules/Block/Block';

export default () => (
  <div>
    <Block headline="Wir sind im Playground" paragraphs={['1. Paragraph', '2. Paragraph']} />
    <Paragraph>
      Noch ein Paragraph
    </Paragraph>
  </div>
);
