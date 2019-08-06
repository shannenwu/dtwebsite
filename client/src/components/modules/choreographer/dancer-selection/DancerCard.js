import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DancerCardOpen from './DancerCardOpen';
import DancerCardClosed from './DancerCardClosed';
import './card.css';

class DancerCard extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      cardOpen: false
    };
  }

  static propTypes = {
    danceObj: PropTypes.object.isRequired,
    isActionable: PropTypes.bool,
    isAccepted: PropTypes.bool,
    isReturn: PropTypes.bool,
    prefsheet: PropTypes.object.isRequired,
    stats: PropTypes.object,
    viewOnly: PropTypes.bool
  }

  static defaultProps = {
    danceObj: {_id: ''},
    isActionable: true,
    isAccepted: false,
    isReturn: false,
    stats: { numAccepted: 0 },
    viewOnly: false
  }

  componentDidMount() {
    this._isMounted = true;

    const { isAccepted } = this.props;
    this.setState({
      cardOpen: !isAccepted
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleCard = () => {
    const { cardOpen } = this.state;
    this.setState({
      cardOpen: !cardOpen
    });
  }

  render() {
    const {
      cardOpen
    } = this.state;

    const {
      danceObj,
      isActionable,
      isAccepted,
      isReturn,
      prefsheet,
      stats,
      viewOnly
    } = this.props;

    if (!cardOpen) {
      return (
        <DancerCardClosed
          isActionable={isActionable}
          prefsheet={prefsheet}
          toggleCard={this.toggleCard}
        />
      );
    }
    return (
      <DancerCardOpen 
        danceObj={danceObj}
        isActionable={isActionable}
        isAccepted={isAccepted}
        isReturn={isReturn}
        prefsheet={prefsheet}
        stats={stats}
        toggleCard={this.toggleCard}
        viewOnly={viewOnly}
      />
    )
  }
}

export default DancerCard;
