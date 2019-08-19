import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Dimmer, Header, Loader
} from 'semantic-ui-react';
import './card.css';

class DancerCardClosed extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  static propTypes = {
    isActionable: PropTypes.bool,
    prefsheet: PropTypes.object.isRequired,
    toggleCard: PropTypes.func.isRequired
  }

  static defaultProps = {
    isActionable: true
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {
      loading
    } = this.state;

    const {
      isActionable,
      prefsheet,
      toggleCard
    } = this.props;

    return (
      <Card className={`dancer-card ${isActionable ? '' : 'inactionable'}`}>
        <Dimmer active={loading} inverted>
          <Loader content='Updating' />
        </Dimmer>
        <Card.Content onDoubleClick={() => toggleCard()}>
          <Header floated='right'>{prefsheet.auditionNumber}</Header>
          <Card.Header>{`${prefsheet.user.firstName} ${prefsheet.user.lastName}`}</Card.Header>
          <Card.Meta>{prefsheet.user.year}</Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

export default DancerCardClosed;
