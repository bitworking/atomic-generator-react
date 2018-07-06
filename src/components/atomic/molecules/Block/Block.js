import React from 'react';
import styled from '../../../../../lib/styler';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

const Block = styled.div`
  background: #eee;
  font-size: 16px;
  ${Heading} {
    font-size: 24px;
  }
  ${Paragraph} {
    color: green;
  }
`;

export default ({heading, paragraph}) => {
  return (   
    <Block>
      <Heading>{heading}</Heading>
      <Paragraph>{paragraph}</Paragraph>
    </Block>
  );
};
