import React from 'react';
import styled from '../../../lib/react-styler';
import Heading from '../atomic/atoms/Heading/Heading';
import Paragraph from '../atomic/atoms/Paragraph/Paragraph';
import Block from '../atomic/molecules/Block/Block';

export default () => {
  return (
    <div>
      <Block heading="Wir sind im Playground" paragraphs={['1. Paragraph', '2. Paragraph']} />
      <Paragraph>Noch ein Paragraph</Paragraph>
    </div>
  );
};