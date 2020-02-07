import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import io from 'socket.io-client';
import { Card, Dimmer, Grid, Header, Loader } from 'semantic-ui-react';
import DancerCard from '../../choreographer/dancer-selection/DancerCard';
import './settings.css';

class AllPrefsheets extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io(`//${window.location.hostname}:${window.location.port}`, { secure: __SECURE__ });

    this.state = {
      cards: [],
      loading: true
    };

    this.socket.on('updated card', async (newDocInfo) => {
      this.updatePrefsheets(newDocInfo);
    });
  }

  static propTypes = {
    userInfo: PropTypes.object
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    this._isMounted = true;
    document.title = 'All Prefsheets';
    this.getAllPrefsheets();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updatePrefsheets = async (newCard) => {
    const { cards } = this.state;

    const prefsheet = newCard.prefsheet;
    const index = cards.findIndex(card => card._id === prefsheet._id);
    var newCards = [...cards];
    if (index !== -1) {
      newCards.splice(index, 1, prefsheet);
    }
    if (this._isMounted) {
      this.setState({
        cards: newCards
      });
    }
  }

  getAllPrefsheets = async () => {
    const response = await axios.get('/api/prefsheets/user');

    this.setState({
      cards: response.data,
      loading: false
    });
  }

  render() {
    const {
      cards,
      loading
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted className='all-prefsheets-loader'>
          <Loader content='Loading all prefsheets...' />
        </Dimmer>
      );
    }
    return (
      <div>
        <Header as='h1'>
          All Prefsheets
          <Header.Subheader
            content={cards.length + ' dancers auditioning'}
          />
        </Header>
        <Grid stackable divided padded columns={1} style={{ height: '100%' }}>
          <Grid.Column>
            <Card.Group>
              {cards.map(card => (
                <DancerCard
                  key={card._id}
                  prefsheet={card}
                  viewOnly={true}
                />)
              )}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AllPrefsheets;
