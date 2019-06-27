// @flow
import * as React from 'react';
import styled from 'react-styler';
import Headline, { H1 } from '../../atoms/Headline/Headline';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import globalVar from '../../../../global/globalVar';
import '../../../../assets/react-hexagon.png';
import ButtonSwitch from '../../atoms/ButtonSwitch/ButtonSwitch';
import Stateful from '../../../utils/Stateful';

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
  headline: string,
  paragraphs: string[]
};

const buttonSwitchProps = {
  textOn: 'An',
  textOff: 'Aus'
};

export default ({ headline, paragraphs }: PropType): React.Node => (
  <Block>
    <Headline tag="h1">
      {headline}
    </Headline>
    {paragraphs.map((paragraph: string, i: number): React.Node => {
      const className = (i >= paragraphs.length - 1) ? 'last' : false;
      return (
        <Paragraph className={className}>
          {paragraph}
        </Paragraph>
      );
    })}
    <Stateful name="atoms-buttonswitch" props={buttonSwitchProps}>
      <ButtonSwitch {...buttonSwitchProps} />
    </Stateful>
  </Block>
);
