// @flow
import * as React from 'react';
import styled from '../../../../../lib/react-styler';

const Button = styled.button`
  background-color: #ddd;
  color: #f0f0f0;
  padding: 20px;
  font-size: 32px;
  border: 2px solid #ccc;
  &:hover {
    background-color: #333;
  }
`;

type PropType = {
  textOn: string,
  textOff: string
};

type StateType = {
  isToggleOn: boolean
};

class ButtonStateful extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = { isToggleOn: true };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick: () => void;

  handleClick() {
    this.setState((prevState: StateType): StateType => ({
      isToggleOn: !prevState.isToggleOn,
    }));
  }

  render(): React.Node {
    const { isToggleOn } = this.state;
    const { textOn, textOff } = this.props;

    return (
      <Button onClick={this.handleClick}>
        {isToggleOn ? textOn : textOff}
      </Button>
    );
  }
}

export default ButtonStateful;
