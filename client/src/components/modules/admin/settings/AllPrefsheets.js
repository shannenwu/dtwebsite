import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Card, Dimmer, Grid, Header, Loader, Message } from 'semantic-ui-react';
import DancerCard from '../../choreographer/dancer-selection/DancerCard';

class AllPrefsheets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      loading: true
    };
  }

  static propTypes = {
    userInfo: PropTypes.object
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    document.title = 'All Prefsheets';
    this.getAllPrefsheets();
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
        <Dimmer active inverted>
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
        <Message header='Warning' compact color='yellow' content='Dance status in prefsheets may not be accurate following completion of dancer selection. Refer to the final dancer list of each dance  in the choreographer page instead.' />
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
