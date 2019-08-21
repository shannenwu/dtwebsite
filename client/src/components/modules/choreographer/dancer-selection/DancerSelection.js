import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Button, Card, Checkbox, Confirm, Dimmer, Header, Grid, Loader
} from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import DancerCard from './DancerCard';
import DancerCardPlaceHolder from './DancerCardPlaceholder';

class DancerSelection extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io(`http://${window.location.hostname}:3000`);

    this.state = {
      open: false,
      loading: true,
      danceObj: null,
      acceptedCards: [],
      pendingCards: [],
      lastPendingCardId: '',
      hasMore: true,
      hideInactionable: false,
      totalActionableCount: 0,
      totalPendingCount: 0,
      redirect: false,
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
    getSingleDance: PropTypes.func.isRequired,
  }

  static defaultProps = {
    userInfo: null,
  }

  async componentDidMount() {
    this._isMounted = true;
    document.title = 'Dancer Selection';

    const { getSingleDance } = this.props;

    const prefsheets = await this.getInitialPrefsheets();
    const countObj = await this.getCount();
    const danceResponse = await getSingleDance(this.props.match.params.danceId);

    const lastId =
      prefsheets.pending.length ? prefsheets.pending[prefsheets.pending.length - 1].prefsheet._id : ''

    this.setState({
      danceObj: danceResponse.data,
      acceptedCards: prefsheets.accepted,
      pendingCards: prefsheets.pending,
      lastPendingCardId: lastId,
      totalActionableCount: countObj.actionableCount,
      totalPendingCount: countObj.pendingCount,
      loading: false,
    });

    this.socket.on('updated card', async (newDocInfo) => {
      this.updatePrefsheets(newDocInfo);
      const countObj = await this.getCount();
      this.setState({
        totalActionableCount: countObj.actionableCount,
        totalPendingCount: countObj.pendingCount,
      })
    });

    this.socket.on('bulk update cards', (docsObj) => {
      this.bulkUpdatePrefsheets(docsObj);
    })
  }

  componentDidUpdate(_prevProps, prevState) {
    const { pendingCards } = this.state;
    if (pendingCards.length !== prevState.pendingCards.length && pendingCards.length) {
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

  bulkUpdatePrefsheets = (docsObj) => {
    const { acceptedCards, pendingCards } = this.state;

    const newPendingCards = pendingCards.map(card => {
      if (docsObj.hasOwnProperty(card.prefsheet._id)) {
        return docsObj[card.prefsheet._id];
      }
      return card;
    });

    const newAcceptedCards = acceptedCards.map(card => {
      if (docsObj.hasOwnProperty(card.prefsheet._id)) {
        return docsObj[card.prefsheet._id];
      }
      return card;
    });
    
    if (this._isMounted) {
      this.setState({
        acceptedCards: newAcceptedCards,
        pendingCards: newPendingCards,
      });
    }

  }

  loadMorePrefsheets = async () => {
    const { pendingCards, lastPendingCardId } = this.state;
    const prefsheetsResponse = await
      axios.get(`/api/auditions/${this.props.match.params.danceId}?last_id=${lastPendingCardId}`);
    const prefsheets = prefsheetsResponse.data;

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
      axios.get(`/api/auditions/${this.props.match.params.danceId}`);
    return prefsheetsResponse.data;
  }

  getCount = async () => {
    const countResponse =
      await axios.get(`/api/auditions/get-count/${this.props.match.params.danceId}`);
    return countResponse.data;
  }

  show = () => this.setState({ open: true })

  handleConfirm = async () => {
    try {
      const response =
        await axios.post(`/api/auditions/finish-selection/${this.props.match.params.danceId}`);
      console.log(response.data);
      this.setState({ 
        open: false,
        redirect: true
      })
    } catch (error) {
      console.log(error);
    }
  }

  handleCancel = () => this.setState({ open: false })

  toggle = () => this.setState(prevState => ({ hideInactionable: !prevState.hideInactionable }));

  render() {
    const {
      open,
      danceObj,
      acceptedCards,
      pendingCards,
      loading,
      hasMore,
      hideInactionable,
      totalPendingCount,
      totalActionableCount,
      redirect
    } = this.state;

    var items = [];
    pendingCards.map((card) => {
      items.push(
        <DancerCard
          key={card.prefsheet._id}
          danceObj={danceObj}
          isActionable={card.actionableDances.includes(danceObj._id)}
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
          <Loader content='Loading selection...' />
        </Dimmer>
      );
    }
    if (redirect) {
      const listLink = `/list/${danceObj._id}`;
      return <Redirect to={listLink} />;
    }
    return (
      <div id='dancer-selection'>
        <Header as='h1' style={{textTransform: 'capitalize'}}>
          {danceObj.name}
          <Button floated='right' onClick={this.show}>I'M DONE PICKING</Button>
          <Confirm
            open={open}
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
            content={'This will reject all remaining ' + totalPendingCount + ' dancers. Continue?'}
          />
        </Header>
        <Grid stackable divided padded columns={2} style={{ height: '100%' }}>
          <Grid.Column className='pending-cards' width={10}>
            <Header as='h3'>
              <Checkbox
                label='Hide inactionable dancers'
                toggle
                onChange={this.toggle}
                checked={hideInactionable}
                style={{ float: 'right' }}
              />
              Pending
              <Header.Subheader
                content={totalActionableCount + ' / ' + totalPendingCount + ' dancers pending'}
              />
            </Header>
            <InfiniteScroll
              className={'ui cards'}
              loadMore={this.loadMorePrefsheets}
              hasMore={hasMore}
              loader={<DancerCardPlaceHolder key={0} />}
            >
              {hideInactionable ? (
                pendingCards
                  .filter(card => card.actionableDances.includes(danceObj._id))
                  .map(card => (
                    <DancerCard
                      key={card.prefsheet._id}
                      danceObj={danceObj}
                      isActionable={card.actionableDances.includes(danceObj._id)}
                      isReturn={card.danceStatuses[danceObj._id].status === 'return'}
                      stats={card.stats}
                      prefsheet={card.prefsheet}
                    />)
                  )
              ) : (
                  pendingCards.map(card => (
                    <DancerCard
                      key={card.prefsheet._id}
                      danceObj={danceObj}
                      isActionable={card.actionableDances.includes(danceObj._id)}
                      isReturn={card.danceStatuses[danceObj._id].status === 'return'}
                      stats={card.stats}
                      prefsheet={card.prefsheet}
                    />)
                  )
                )}
            </InfiniteScroll>
          </Grid.Column>
          <Grid.Column className='accepted-cards' width={6}>
            <Header as='h3'>
              Accepted
              <Header.Subheader 
                content={acceptedCards.length + ' dancers accepted'}
              />
            </Header>
            <Card.Group>
              {acceptedCards.map((card) => (
                <DancerCard
                  key={card.prefsheet._id}
                  danceObj={danceObj}
                  isActionable={card.actionableDances.includes(danceObj._id)}
                  stats={card.stats}
                  isAccepted
                  prefsheet={card.prefsheet}
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