import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Header, Confirm, Grid, Button, Card, Icon, Dimmer, Loader,
} from 'semantic-ui-react';
import DancerCard from './DancerCard';

class DancerSelection extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io('http://localhost:3000');

    this.state = {
      open: false,
      loading: true,
      danceObj: null,
      acceptedCards: [],
      pendingCards: [],
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

    this.socket.on('updated card', (prefsheet_id) => {
      this.getUpdatedPrefsheet(prefsheet_id);
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

  // TODO check if you can optimize
  getUpdatedPrefsheet = async (prefsheetId) => {
    const { acceptedCards, pendingCards } = this.state;

    const response = await axios.get(`/api/prefsheets/auditions/${this.props.match.params.danceId}/${prefsheetId}`);
    const prefObj = response.data;

    // Only update state if it's even possible for this card to be on the page
    if (prefObj.stats.dancePreffed) {
      const acceptedIndex = acceptedCards.findIndex(card => card.prefsheet._id === prefObj.prefsheet._id);
      const pendingIndex = pendingCards.findIndex(card => card.prefsheet._id === prefObj.prefsheet._id);

      var newAcceptedCards = [...acceptedCards];
      var newPendingCards = [...pendingCards];

      // Update initially performed on pending column
      if (pendingIndex !== -1) {
        // Simply update the card in the pending column.
        if (prefObj.stats.status === 'pending' || prefObj.stats.status === 'return') {
          newPendingCards.splice(pendingIndex, 1, prefObj);
        } else if (prefObj.stats.status === 'accepted') {
          // Remove from pending column and move to accepted column
          newAcceptedCards = [prefObj].concat(newAcceptedCards);
          newPendingCards.splice(pendingIndex, 1);
        } else if (prefObj.stats.status === 'rejected') {
          newPendingCards.splice(pendingIndex, 1);
        }
      } else if (acceptedIndex !== -1) {
        // Update initially performed on accepted column (return or reject)  
        // Remove from accepted column
        newAcceptedCards.splice(acceptedIndex, 1);
        if (prefObj.stats.status === 'return') {
          newPendingCards = [prefObj].concat(newPendingCards);
        }
      }
      if (this._isMounted) {
        this.setState({
          acceptedCards: newAcceptedCards,
          pendingCards: newPendingCards,
        });
      }
    }
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
      loading: false,
    });
  }

  show = () => this.setState({ open: true })

  handleConfirm = async () => { 
    const response = 
      await axios.get(`/api/prefsheets/auditions/${this.props.match.params.danceId}/reject-remaining`);
    console.log(response.data);
    this.setState({ open: false })
  }

  handleCancel = () => this.setState({ open: false })

  render() {
    const {
      open,
      danceObj,
      acceptedCards,
      pendingCards,
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
          <Button floated='right' onClick={this.show}>I'M DONE PICKING</Button>
          <Confirm 
            open={open} 
            onCancel={this.handleCancel} 
            onConfirm={this.handleConfirm} 
            content={'This will reject all remaining ' + pendingCards.length + ' dancers. Continue?'}
          />
        </Header>
        <Grid stackable divided padded columns={2} style={{ height: '100%' }}>
          <Grid.Column className="pending-cards" width={10}>
            <Header as="h3">
              Pending
              <Header.Subheader>{pendingCards.length + ' dancers pending'}</Header.Subheader>
            </Header>
            <Card.Group>
              {pendingCards.map((card) => (
                <DancerCard
                  key={card.prefsheet._id}
                  danceObj={danceObj}
                  isActionable={card.actionable}
                  isReturn={card.stats.status === 'return'}
                  stats={card.stats}
                  prefsheet={card.prefsheet}
                  loading={loading}
                />
              ))}
            </Card.Group>
          </Grid.Column>
          <Grid.Column className="accepted-cards" width={6}>
            <Header as="h3">
              Accepted
              <Header.Subheader>{acceptedCards.length + ' dancers accepted'}</Header.Subheader>
            </Header>
            <Card.Group>
              {acceptedCards.map((card) => (
                <DancerCard
                  key={card.prefsheet._id}
                  danceObj={danceObj}
                  isActionable={card.actionable}
                  stats={card.stats}
                  isAccepted
                  prefsheet={card.prefsheet}
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
