// @flow
import * as React from 'react';
import styled from '../../../../../lib/react-styler';
import Heading, { H1 } from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import globalVar from '../../../../global/globalVar';
import '../../../../assets/react-hexagon.png';

const borderWidth = 2;

const localVar = `
  border: ${borderWidth}px solid black;
`;

const localVar2 = 'border-radius: 10px;';

const Block = styled.div`
  display: grid;
  background: #f0f0f0;
  padding: 10px;
  ${localVar}
  ${localVar2}
  ${globalVar}
  ${H1} {
    font-size: 24px;
    color: #999;
    margin-bottom: 15px;
  }
  ${Paragraph} {
    color: #333;
    margin-bottom: 10px;
    &.last {
      margin-bottom: 0;
    }
  }
`;

type PropType = {
  heading: string,
  paragraphs: string[]
};

export default ({ heading, paragraphs }: PropType): React.Node => (
  <Block>
    <Heading tag="h1">
      {heading}
    </Heading>
    {paragraphs.map((paragraph: string, i: number): React.Node => {
      const className = (i >= paragraphs.length - 1) ? 'last' : false;
      return (
        <Paragraph className={className}>
          {paragraph}
        </Paragraph>
      );
    })}
  </Block>
);
