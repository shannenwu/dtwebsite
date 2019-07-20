import React from 'react';
import {
  Grid, Header, Dimmer, Loader
} from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';
import ShowList from '../modules/admin/ShowList';
import DanceList from '../modules/admin/DanceList';
import ShowSettings from '../modules/admin/ShowSettings';

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
      userOptions: [],
      loading: true,
      endpoint: 'http://localhost:3000',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { shows, endpoint } = this.state;

    document.title = 'Admin Page';
    // make get request to load shows, dances
    this.getShowsAndDances();
    this.getUserOptions();
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

  getUserOptions = () => {
    axios.get('/api/users')
      .then(
        (response) => {
          const users = response.data;
          var userOptions = users.map(user => {
            return {
              key: user.firstName + ' ' + user.lastName,
              text: user.firstName + ' ' + user.lastName,
              value: user._id
            };
          })
          this.setState({
            userOptions: userOptions
          })
        },
      );
  }

  getShowsAndDances = async () => {
    try {
      const [activeShowResponse, allShowsResponse] = await Promise.all([
        axios.get('/api/shows/active'),
        axios.get('/api/shows')
      ]);

      const activeShow = activeShowResponse.data;
      const selectedShow = allShowsResponse.data[0];

      const dancesResponse = await axios.get(`/api/dances/${selectedShow._id}/all`);

      this.setState({
        shows: allShowsResponse.data,
        dances: dancesResponse.data,
        activeShow,
        selectedShow,
        loading: false,
        prefsOpen: activeShow.prefsOpen
      })
    } catch (e) {
      console.log(e); // TODO ERROR HANDLE 
    }
  }

  getDances = async (id) => {
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

  selectShow = async (showObj) => {
    const dancesResponse = await axios.get(`/api/dances/${showObj._id}/all`);
    this.setState({
      dances: dancesResponse.data,
      selectedShow: showObj,
    });
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

  generateAuditionNumbers = () => {
    const {
      activeShow
    } = this.state;
    axios.post(`/api/prefsheets/generate-audition-numbers/${activeShow._id}/`)
    .then(
      (response) => {
        // this.setState({
        //   // TODO: some success message.
        // });
        return response;
      },
    );
  }

  render() {
    const {
      shows,
      dances,
      selectedShow,
      activeShow,
      userOptions,
      prefsOpen,
      loading,
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader></Loader>
        </Dimmer>
      );
    }
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
            />
          </Grid.Column>
          <Grid.Column>
            <DanceList
              selectedShow={selectedShow}
              dances={dances}
              handleDeleteDance={this.handleDeleteDance}
              userOptions={userOptions} />
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
                generateAuditionNumbers={this.generateAuditionNumbers}
                userOptions={userOptions}
              />
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default AdminPage;
