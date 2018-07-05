import React from 'react';
import styled from '../../../../../lib/styler';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

const BlockStyled = styled.div`
  background: #eee;
  font-size: 16px;
  ${Heading} {
    font-size: 24px;
  }
  ${Paragraph} {
    color: blue;
  }
`;

export default () => {
  return (   
    <BlockStyled>
      <Heading>Und jetzt?</Heading>
      <Paragraph>Aiiiiight</Paragraph>
    </BlockStyled>
  );
};

