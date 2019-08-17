import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Header, Card, Grid, Image, Button, Dimmer, Loader,
} from 'semantic-ui-react';
import PrefList from './PrefList';
import './card.css';

class DancerCardOpen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  static propTypes = {
    danceObj: PropTypes.object,
    isActionable: PropTypes.bool,
    isAccepted: PropTypes.bool,
    isReturn: PropTypes.bool,
    prefsheet: PropTypes.object.isRequired,
    stats: PropTypes.object,
    toggleCard: PropTypes.func.isRequired,
    viewOnly: PropTypes.bool
  }

  static defaultProps = {
    danceObj: { _id: '' },
    isActionable: true,
    isAccepted: false,
    isReturn: false,
    stats: { numAccepted: 0 },
    viewOnly: false
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  addDefaultImage = (e) => {
    e.target.src = 'https://react.semantic-ui.com/images/avatar/large/matthew.png';
  }

  handleStatusUpdate = async (prefsheetId, update) => {
    const { danceObj } = this.props;
    if (this._isMounted) {
      this.setState({
        loading: true
      })
    }
    const response =
      await axios.post(`/api/auditions/${danceObj._id}/${prefsheetId}`, {
        status: update
      });

    if (this._isMounted) {
      this.setState({
        loading: false
      })
    }
    return response.data; // TODO ERROR HANDLING quick popup
  }

  render() {
    const {
      loading
    } = this.state;

    const {
      isActionable,
      isAccepted,
      isReturn,
      prefsheet,
      stats,
      toggleCard,
      viewOnly
    } = this.props;

    return (
      <Card className={`dancer-card ${isActionable ? '' : 'inactionable'}`} onDoubleClick={isAccepted ? () => toggleCard() : null}>
        <Dimmer active={loading} inverted>
          <Loader content='Updating' />
        </Dimmer>
        <Card.Content>
          <Header floated="right">{prefsheet.auditionNumber}</Header>
          <Card.Header>{`${prefsheet.user.firstName} ${prefsheet.user.lastName}`}</Card.Header>
          <Card.Meta>{prefsheet.user.year}</Card.Meta>
          <Grid stackable centered columns="equal" style={{ minWidth: '100%' }}>
            <Grid.Column className="dancer-image">
              <Image
                size="small"
                src={prefsheet.user.imageUrl}
                onError={this.addDefaultImage}
              />
            </Grid.Column>
            <Grid.Column style={{
              height: '145px', overflow: 'auto', paddingLeft: '0', marginRight: '14px',
            }}
            >
              <PrefList rankedDances={prefsheet.rankedDances} />
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          {'Max: ' + prefsheet.maxDances}
          {!viewOnly &&
            <Button.Group floated="right">
              <Button
                disabled={isAccepted || !isActionable}
                icon="check"
                size="tiny"
                color="green"
                onClick={() => this.handleStatusUpdate(prefsheet._id, 'accepted')}
              />
              <Button
                disabled={
                  isReturn ||
                  !isActionable ||
                  (stats.numAccepted > 0 && !isAccepted) ||
                  (stats.numAccepted > 1 && isAccepted)
                }
                icon="undo"
                size="tiny"
                color="yellow"
                onClick={() => this.handleStatusUpdate(prefsheet._id, 'return')}
              />
              <Button
                disabled={!isActionable}
                icon="cancel"
                size="tiny"
                color="red"
                onClick={() => this.handleStatusUpdate(prefsheet._id, 'rejected')}
              />
            </Button.Group>}
        </Card.Content>
      </Card>
    );
  }
}

export default DancerCardOpen;
