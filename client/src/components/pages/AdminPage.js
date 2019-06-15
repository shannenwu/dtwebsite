import React from 'react';
import {
  Grid, Header, Form, Button, Modal, Icon,
} from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';
import ShowList from '../modules/ShowList';
import DanceList from '../modules/DanceList';
import ShowSettings from '../modules/ShowSettings';

class AdminPage extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io('http://localhost:3000');

    this.state = {
      shows: [],
      dances: [],
      activeShow: null,
      prefsOpen: false,
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
          selectedShow: showObj,
        });
      }
    });
    socket.on('dance', (danceObj) => {
      const newDances = [danceObj].concat(this.state.dances);
      if (this._isMounted) {
        this.setState({
          dances: newDances
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
          var activeShow = shows.find(obj => {
            return obj.isActive === true
          })
          this.setState({
            shows,
            activeShow,
            selectedShow: shows[0],
            loading: false,
            prefsOpen: activeShow.prefsOpen
          });
          return this.getDances(shows[0]._id);
        },
      );
  }

  getDances = (id) => {
    axios.get(`/api/dances/${id}/all`)
      .then(
        (response) => {
          const dances = response.data;
          this.setState({
            dances
          });
        },
      );
  }

  selectShow = (showObj) => {
    this.setState({
      selectedShow: showObj,
    });
    this.getDances(showObj._id);
  }

  handleDeleteShow = (id) => {
    const {
      shows
    } = this.state;
    axios.delete(`/api/shows/${id}`)
      .then(
        (response) => {
          const removedShow = response.data;
          var showsCopy = [...shows];
          const index = showsCopy.findIndex(x => x._id === removedShow._id);
          if (index !== -1) {
            showsCopy.splice(index, 1);
            this.setState({
              shows: showsCopy
            });
          }
        },
      );
  }

  handleDeleteDance = (id) => {
    const {
      dances
    } = this.state;
    axios.delete(`/api/dances/${id}`)
      .then(
        (response) => {
          const removedDance = response.data;
          var dancesCopy = [...dances];
          const index = dancesCopy.findIndex(x => x._id === removedDance._id);
          if (index !== -1) {
            dancesCopy.splice(index, 1);
            this.setState({
              dances: dancesCopy
            });
          }
        },
      );
  }

  setActiveShow = (id) => {
    axios.post(`/api/shows/${id}/active-show`)
      .then(
        (response) => {
          const activeShow = response.data;
          this.setState({
            activeShow
          });
        },
      );
  }

  togglePrefs = () => {
    const {
      activeShow,
      prefsOpen
    } = this.state;
    axios.post(`/api/shows/${activeShow._id}/prefs?open=${!prefsOpen}`)
      .then(
        (response) => {
          const activeShow = response.data;
          this.setState({
            prefsOpen: !prefsOpen
          });
        },
      );
  }

  render() {
    const {
      shows,
      dances,
      selectedShow,
      activeShow,
      prefsOpen,
      loading,
    } = this.state;

    return (
      <React.Fragment>
        <Header as="h1">
          Administrative Options
        </Header>
        <Grid padded columns={3} style={{ height: '100%' }}>
          <Grid.Column>
            <ShowList
              shows={shows}
              activeShow={activeShow}
              selectedShow={selectedShow}
              selectShow={this.selectShow}
              handleDeleteShow={this.handleDeleteShow}
              loading={loading}
            />
          </Grid.Column>
          <Grid.Column>
            <DanceList
              selectedShow={selectedShow}
              dances={dances}
              handleDeleteDance={this.handleDeleteDance}
              loading={loading} />
          </Grid.Column>
          <Grid.Column stretched>
            <Grid.Row style={{ height: '50%' }}>
              <Header as="h3">
                Dancers
              </Header>
            </Grid.Row>
            <Grid.Row style={{ height: '50%' }}>
              <ShowSettings
                activeShow={activeShow}
                setActiveShow={this.setActiveShow}
                selectedShow={selectedShow}
                prefsOpen={prefsOpen}
                togglePrefs={this.togglePrefs}
              />
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default AdminPage;
