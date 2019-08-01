import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Header, Confirm, Grid, Button, Card, Icon, Dimmer, Loader,
} from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
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
      lastPendingCardId: '',
      hasMore: true,
      endpoint: 'http://localhost:3000/',
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
  }

  static defaultProps = {
    userInfo: null,
  }

  async componentDidMount() {
    this._isMounted = true;
    document.title = 'Dancer Selection';

    const prefsheets = await this.getInitialPrefsheets();
    const danceObj = await this.getDance();

    this.setState({
      danceObj,
      acceptedCards: prefsheets.accepted,
      pendingCards: prefsheets.pending,
      // TODO CHECK IF THERE IS ANY PENDING
      lastPendingCardId: prefsheets.pending[prefsheets.pending.length - 1].prefsheet._id,
      // hasMore: prefsheets.hasMore,
      loading: false,
    });

    this.socket.on('updated card', (newDocInfo) => {
      this.updatePrefsheets(newDocInfo);
    });
  }

  // TODO test
  componentDidUpdate(prevProps, prevState) {
    const { pendingCards } = this.state;
    if (pendingCards.length !== prevState.pendingCards.length) {
      this.setState({
        lastPendingCardId: pendingCards[pendingCards.length - 1].prefsheet._id
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updatePrefsheets = (newCard) => {
    const { danceObj, acceptedCards, pendingCards } = this.state;

    const isPreffed = newCard.danceStatuses.hasOwnProperty(danceObj._id);

    // Selection page only needs to handle a card update if it can appear on the page.
    if (isPreffed) {
      const status = newCard.danceStatuses[danceObj._id].status;
      const acceptedIndex = acceptedCards.findIndex(card => card.prefsheet._id === newCard.prefsheet._id);
      const pendingIndex = pendingCards.findIndex(card => card.prefsheet._id === newCard.prefsheet._id);

      var newAcceptedCards = [...acceptedCards];
      var newPendingCards = [...pendingCards];
      // Update initially performed on pending column
      if (pendingIndex !== -1) {
        // Simply update the card in the pending column.
        if (status === 'pending' || status === 'return') {
          newPendingCards.splice(pendingIndex, 1, newCard);
        } else if (status === 'accepted') {
          // Remove from pending column and move to accepted column
          newAcceptedCards = [newCard].concat(newAcceptedCards);
          newPendingCards.splice(pendingIndex, 1);
        } else if (status === 'rejected') {
          newPendingCards.splice(pendingIndex, 1);
        }
      } else if (acceptedIndex !== -1) {
        if (status === 'return') {
          // Remove from accepted column and put back into pending.
          newAcceptedCards.splice(acceptedIndex, 1);
          newPendingCards = newPendingCards.concat(newCard);
        } else if (status === 'accepted') {
          // Simply update the card in the accepted column.
          newAcceptedCards.splice(acceptedIndex, 1, newCard);
        } else if (status === 'rejected') {
          // Remove from accepted column.
          newAcceptedCards.splice(acceptedIndex, 1);
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

  loadMorePrefsheets = async () => {
    const { pendingCards, lastPendingCardId } = this.state;
    const prefsheetsResponse = await
      axios.get(`/api/prefsheets/auditions/${this.props.match.params.danceId}?last_id=${lastPendingCardId}`);
    const prefsheets = prefsheetsResponse.data;
    console.log(prefsheets);

    var newPendingCards = [...pendingCards];
    prefsheets.pending.map(card => {
      newPendingCards.push(card);
    });

    this.setState({
      pendingCards: newPendingCards,
      hasMore: prefsheets.hasMore
    })
  }

  getInitialPrefsheets = async () => {
    const prefsheetsResponse = await
      axios.get(`/api/prefsheets/auditions/${this.props.match.params.danceId}`);
    return prefsheetsResponse.data;
  }

  getDance = async () => {
    const danceResponse = await axios.get(`/api/dances/${this.props.match.params.danceId}`);
    return danceResponse.data;
  }

  // TODO must be rewritten after infinite scroll 
  countActionableCards = () => {
    const { danceObj, pendingCards } = this.state;

    var count = 0;
    for (var i = 0; i < pendingCards.length; i++) {
      var card = pendingCards[i];
      if (card.stats.actionableDances.includes(danceObj._id)) {
        count += 1;
      }
    }
    return count;
  }

  show = () => this.setState({ open: true })

  handleConfirm = async () => {
    const response =
      await axios.post(`/api/prefsheets/auditions/reject-remaining/${this.props.match.params.danceId}`);
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
      lastPendingCardId,
      hasMore
    } = this.state;

    var items = [];
    pendingCards.map((card) => {
      items.push(
        <DancerCard
          key={card.prefsheet._id}
          danceObj={danceObj}
          isActionable={card.stats.actionableDances.includes(danceObj._id)}
          isReturn={card.danceStatuses[danceObj._id].status === 'return'}
          stats={card.stats}
          prefsheet={card.prefsheet}
          loading={loading}
        />
      );
    });

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
              <Header.Subheader>
                {this.countActionableCards() + ' / ' + pendingCards.length + ' dancers pending'}
              </Header.Subheader>
            </Header>
            <Card.Group>
              <InfiniteScroll
                loadMore={this.loadMorePrefsheets}
                hasMore={hasMore}
                loader={<div className="loader" key={0}>Loading ...</div>}
              >
                {pendingCards.map((card) => (
                  <DancerCard
                    key={card.prefsheet._id}
                    danceObj={danceObj}
                    isActionable={card.stats.actionableDances.includes(danceObj._id)}
                    isReturn={card.danceStatuses[danceObj._id].status === 'return'}
                    stats={card.stats}
                    prefsheet={card.prefsheet}
                    loading={loading}
                  />)
                )}
              </InfiniteScroll>
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
                  isActionable={card.stats.actionableDances.includes(danceObj._id)}
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
