import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Header, Grid, Image, Button, Card, Icon, Dimmer, Loader
} from 'semantic-ui-react';
import DancerCard from './DancerCard';

class DancerSelection extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io('http://localhost:3000');

    this.state = {
      loading: true,
      danceName: '',
      acceptedCards: [],
      pendingCards: [],
      returnCards: [],
      endpoint: 'http://localhost:3000',
    };
  }

  static propTypes = {
    userInfo: PropTypes.object
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    this._isMounted = true;
    const { endpoint } = this.state;

    document.title = 'Dancer Selection';
    this.getPrefsheetsAndDanceName();

    const socket = io(endpoint);
    socket.on('accepted card', (prefObj) => {
      // TODO remove card from pending
      const newCards = [prefObj].concat(this.state.acceptedCards);
      if (this._isMounted) {
        this.setState({
          acceptedCards: newCards
        });
      }
    });
  }

  getPrefsheetsAndDanceName = async () => {
    const [prefsheetsResponse, danceResponse] = await Promise.all([
      axios.get(`/api/prefsheets/auditions/${this.props.match.params.danceId}`),
      axios.get(`/api/dances/${this.props.match.params.danceId}`)
    ]);

    const prefsheets = prefsheetsResponse.data;
    const dance = danceResponse.data;

    this.setState({
      danceName: dance.name,
      acceptedCards: prefsheets.accepted,
      pendingCards: prefsheets.pending,
      returnCards: prefsheets.return,
      loading: false
    });
  }

  handleStatusUpdate = async (prefsheet_id, update) => {
    const response =
      await axios.post(`/api/prefsheets/auditions/${this.props.match.params.danceId}/${prefsheet_id}`, {
        status: update
      });
    return response.data; // TODO ERROR HANDLING quick popup
  }

  render() {
    const {
      danceName,
      acceptedCards,
      pendingCards,
      returnCards,
      loading
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader></Loader>
        </Dimmer>
      );
    }
    return (
      <div id="dancer-selection">
        {console.log(acceptedCards)}
        <Header as="h1">
          {danceName}
        </Header>
        <Grid stackable divided padded columns={2} style={{ height: '100%' }}>
          <Grid.Column className="pending-cards" width={10}>
            <Header as="h3">
              Pending
            </Header>
            <Card.Group>
              {pendingCards.map((card, index) => {
                return (
                  <DancerCard
                    key={index}
                    data={card}
                    handleStatusUpdate={this.handleStatusUpdate}
                    loading={loading}
                  />)
              })}
              {returnCards.map((card, index) => {
                return (
                  <DancerCard
                    key={index}
                    isReturn={true}
                    data={card}
                    handleStatusUpdate={this.handleStatusUpdate}
                    loading={loading}
                  />)
              })}
            </Card.Group>
          </Grid.Column>
          <Grid.Column className="accepted-cards" width={6}>
            <Header as="h3">
              Accepted
            </Header>
            <Card.Group>
              {acceptedCards.map((card, index) => {
                return (
                  <DancerCard
                    key={index}
                    isAccepted={true}
                    data={card}
                    handleStatusUpdate={this.handleStatusUpdate}
                    loading={loading}
                  />)
              })}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default DancerSelection;