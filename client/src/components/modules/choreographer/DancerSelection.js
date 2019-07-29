import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Header, Grid, Button, Card, Icon, Dimmer, Loader,
} from 'semantic-ui-react';
import DancerCard from './DancerCard';

class DancerSelection extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io('http://localhost:3000');

    this.state = {
      loading: true,
      danceObj: null,
      acceptedCards: [],
      pendingCards: [],
      returnCards: [],
      endpoint: 'http://localhost:3000/',
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    this._isMounted = true;

    document.title = 'Dancer Selection';
    this.getPrefsheetsAndDance();

    // did not decompose state in order to get most recent one. consider using prevState.
    this.socket.on('accepted card', (prefObj) => {
      const newPendingCards = this.state.pendingCards.filter(card => card.prefsheet._id !== prefObj.prefsheet._id);
      const newAcceptedCards = [prefObj].concat(this.state.acceptedCards);
      if (this._isMounted) {
        this.setState({
          acceptedCards: newAcceptedCards,
          pendingCards: newPendingCards,
        });
      }
    });

    this.socket.on('remove card', (prefObj) => {
      const newPendingCards = this.state.pendingCards.filter(card => card.prefsheet._id !== prefObj.prefsheet._id);
      if (this._isMounted) {
        this.setState({
          pendingCards: newPendingCards,
        });
      }
    });

    this.socket.on('new pending card', (prefObj) => {
      // TODO change colors, not just actionable
      var newPendingCards = [...this.state.pendingCards];
      const index = this.state.pendingCards.findIndex(card => card.prefsheet._id === prefObj.prefsheet._id);
      newPendingCards[index].actionable = true;

      console.log(newPendingCards);
      if (this._isMounted) {
        this.setState({
          pendingCards: newPendingCards,
        });
      }
    });
    // TODO REMOVE LATER FOR DEBUGGING ONLY
    this.socket.on('connected to room', (res) => {
      console.log(res);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { danceObj } = this.state;
    if (danceObj !== prevState.danceObj) {
      this.socket.emit('room', `room_${danceObj._id}`);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getPrefsheetsAndDance = async () => {
    const [prefsheetsResponse, danceResponse] = await Promise.all([
      axios.get(`/api/prefsheets/auditions/${this.props.match.params.danceId}`),
      axios.get(`/api/dances/${this.props.match.params.danceId}`),
    ]);

    const prefsheets = prefsheetsResponse.data;
    const dance = danceResponse.data;

    this.setState({
      danceObj: dance,
      acceptedCards: prefsheets.accepted,
      pendingCards: prefsheets.pending,
      returnCards: prefsheets.return,
      loading: false,
    });
  }

  handleStatusUpdate = async (prefsheetId, update, actionableDances) => {
    const response =
      await axios.post(`/api/prefsheets/auditions/${this.props.match.params.danceId}/${prefsheetId}`, {
        status: update,
        actionableDances
      });
    return response.data; // TODO ERROR HANDLING quick popup
  }

  render() {
    const {
      danceObj,
      acceptedCards,
      pendingCards,
      returnCards,
      loading,
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }
    return (
      <div id="dancer-selection">
        <Header as="h1">
          {danceObj.name}
        </Header>
        <Grid stackable divided padded columns={2} style={{ height: '100%' }}>
          <Grid.Column className="pending-cards" width={10}>
            <Header as="h3">
              Pending
            </Header>
            <Card.Group>
              {pendingCards.map((card) => (
                <DancerCard
                  key={card.prefsheet._id}
                  isActionable={card.actionable}
                  stats={card.stats}
                  prefsheet={card.prefsheet}
                  handleStatusUpdate={this.handleStatusUpdate}
                  loading={loading}
                />
              ))}
              {returnCards.map((card) => (
                <DancerCard
                  key={card.prefsheet._id}
                  isActionable={card.actionable}
                  stats={card.stats}
                  isReturn
                  prefsheet={card.prefsheet}
                  handleStatusUpdate={this.handleStatusUpdate}
                  loading={loading}
                />
              ))}
            </Card.Group>
          </Grid.Column>
          <Grid.Column className="accepted-cards" width={6}>
            <Header as="h3">
              Accepted
            </Header>
            <Card.Group>
              {acceptedCards.map((card) => (
                <DancerCard
                  key={card.prefsheet._id}
                  isActionable={card.actionable}
                  stats={card.stats}
                  isAccepted
                  prefsheet={card.prefsheet}
                  handleStatusUpdate={this.handleStatusUpdate}
                  loading={loading}
                />
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default DancerSelection;
