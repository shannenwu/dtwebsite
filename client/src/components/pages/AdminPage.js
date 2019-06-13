import React from 'react';
import {
  Grid, Header, Form, Button, Modal, Icon,
} from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';
import ShowList from '../modules/ShowList';
import DanceList from '../modules/DanceList';

class AdminPage extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io('http://localhost:3000');

    this.state = {
      shows: [],
      selectedShow: null,
      loading: true,
      endpoint: 'http://localhost:3000',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { shows, endpoint } = this.state;

    document.title = 'Admin Page';
    // make get request to load shows, dances
    this.getShows();
    const socket = io(endpoint);
    socket.on('show', (showObj) => {
      const newShows = [showObj].concat(this.state.shows);
      newShows.sort((a, b) => ((a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0)));
      if (this._isMounted) {
        this.setState({
          shows: newShows,
          selectedShow: showObj._id,
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getShows = () => {
    axios.get('/api/shows')
      .then(
        (response) => {
          const shows = response.data;
          this.setState({
            shows,
            selectedShow: shows[0]._id,
            loading: false,
          });
        },
      );
  }

  selectShow = (id) => {
    this.setState({
      selectedShow: id,
    });
  }

  render() {
    const {
      shows,
      selectedShow,
      loading,
    } = this.state;

    return (
      <React.Fragment>
        <Header as="h1">
          Administrative Options
        </Header>
        <Grid padded columns={3} style={{ height: '100%' }}>
          <Grid.Column>
            <ShowList shows={shows} selectedShow={selectedShow} selectShow={this.selectShow} loading={loading} />
          </Grid.Column>
          <Grid.Column>
            <DanceList selectedShow={selectedShow} />
          </Grid.Column>
          <Grid.Column stretched>
            <Grid.Row style={{ height: '50%' }}>
              <Header as="h3">
                Dancers
              </Header>
            </Grid.Row>
            <Grid.Row style={{ height: '50%' }}>
              <Header as="h3">
                Show Settings
              </Header>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default AdminPage;
