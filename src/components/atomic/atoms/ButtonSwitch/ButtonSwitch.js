import React from 'react';
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

class ButtonStateful extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <Button onClick={this.handleClick}>
        {this.state.isToggleOn ? this.props.textOn : this.props.textOff}
      </Button>
    );
  }
}

export default ButtonStateful;