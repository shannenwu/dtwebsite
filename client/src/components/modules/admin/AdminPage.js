import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Grid, Header, Loader } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';
import ShowList from './show/ShowList';
import DanceList from './dance/DanceList';
import ShowSettings from './settings/ShowSettings';
import './admin.css';

class AdminPage extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io(`http://${window.location.hostname}:3000`);

    this.state = {
      shows: [],
      dances: [],
      activeShow: null,
      prefsOpen: false,
      prodConflictsOpen: false,
      selectedShow: null,
      userOptions: [],
      danceOptions: [],
      loading: true,
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
    getActiveShow: PropTypes.func,
    getDances: PropTypes.func,
    getDanceOptions: PropTypes.func,
    getUserOptions: PropTypes.func
  }

  async componentDidMount() {
    this._isMounted = true;
    const { getUserOptions } = this.props;

    document.title = 'Admin';
    // make get request to load shows, dances
    this.getShowsAndDances();
    // load all user options
    const userOptions = await getUserOptions();
    this.setState({
      userOptions
    });

    this.socket.on('show', (showObj) => {
      const newShows = [showObj].concat(this.state.shows);
      newShows.sort((a, b) => ((a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0)));
      if (this._isMounted) {
        this.setState({
          shows: newShows,
          selectedShow: showObj,
        });
      }
    });
    this.socket.on('dance', (danceObj) => {
      const newDances = [danceObj].concat(this.state.dances);
      if (this._isMounted) {
        this.setState({
          dances: newDances,
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAllShows = async () => {
    try {
      const response = await axios.get('/api/shows');
      return response;
    } catch (e) {
      console.log(e); // TODO FIX LATER
    }
  }

  getShowsAndDances = async () => {
    const {
      getActiveShow,
      getDances,
      getDanceOptions,
    } = this.props;
    try {
      const [activeShowResponse, allShowsResponse] = await Promise.all([
        getActiveShow(),
        this.getAllShows(),
      ]);

      const activeShow = activeShowResponse.data;
      const selectedShow = allShowsResponse.data[0];

      const [selectedDancesResponse, activeDancesResponse] = await Promise.all([
        getDances(selectedShow._id),
        getDances(activeShow._id),
      ]);

      const danceOptions = getDanceOptions(activeDancesResponse.data);

      this.setState({
        shows: allShowsResponse.data,
        dances: selectedDancesResponse.data,
        activeShow,
        selectedShow,
        danceOptions,
        loading: false,
        prefsOpen: activeShow.prefsOpen,
        prodConflictsOpen: activeShow.prodConflictsOpen
      });
    } catch (e) {
      console.log(e); // TODO ERROR HANDLE
    }
  }

  selectShow = async (showObj) => {
    const {
      getDances,
    } = this.props;
    const dancesResponse = await getDances(showObj._id);
    this.setState({
      dances: dancesResponse.data,
      selectedShow: showObj,
    });
  }

  handleDeleteShow = (id) => {
    const {
      shows,
    } = this.state;
    axios.delete(`/api/shows/${id}`)
      .then(
        (response) => {
          const removedShow = response.data;
          const showsCopy = [...shows];
          const index = showsCopy.findIndex(x => x._id === removedShow._id);
          if (index !== -1) {
            showsCopy.splice(index, 1);
            this.setState({
              shows: showsCopy,
            });
          }
        },
      );
  }

  handleDeleteDance = (id) => {
    const {
      dances,
    } = this.state;
    axios.delete(`/api/dances/${id}`)
      .then(
        (response) => {
          const removedDance = response.data;
          const dancesCopy = [...dances];
          const index = dancesCopy.findIndex(x => x._id === removedDance._id);
          if (index !== -1) {
            dancesCopy.splice(index, 1);
            this.setState({
              dances: dancesCopy,
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
            activeShow,
          });
        },
      );
  }

  togglePrefs = () => {
    const {
      activeShow,
      prefsOpen,
    } = this.state;
    axios.post(`/api/shows/${activeShow._id}/prefs?open=${!prefsOpen}`)
      .then(
        (response) => {
          const activeShow = response.data;
          this.setState({
            prefsOpen: !prefsOpen,
          });
        },
      );
  }

  toggleProdConflicts = () => {
    const {
      activeShow,
      prodConflictsOpen,
    } = this.state;
    axios.post(`/api/shows/${activeShow._id}/prod-conflicts?open=${!prodConflictsOpen}`)
      .then(
        (response) => {
          const activeShow = response.data;
          this.setState({
            prodConflictsOpen: !prodConflictsOpen,
          });
        },
      );
  }

  generateAuditionNumbers = () => {
    axios.post('/api/auditions/generate-audition-numbers/')
      .then(
        response => {
          // TODO success message
          console.log(response);
        }
      );
  }

  render() {
    const {
      shows,
      dances,
      selectedShow,
      activeShow,
      userOptions,
      danceOptions,
      prefsOpen,
      prodConflictsOpen,
      loading,
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted className='admin-loader'>
          <Loader content='Loading...' />
        </Dimmer>
      );
    }
    return (
      <React.Fragment>
        <Header as='h1'>
          Admin
        </Header>
        <Grid stackable padded columns={3} style={{ height: '100%' }}>
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
              userOptions={userOptions}
            />
          </Grid.Column>
          <Grid.Column stretched>
            <ShowSettings
              activeShow={activeShow}
              setActiveShow={this.setActiveShow}
              selectedShow={selectedShow}
              prefsOpen={prefsOpen}
              togglePrefs={this.togglePrefs}
              prodConflictsOpen={prodConflictsOpen}
              toggleProdConflicts={this.toggleProdConflicts}
              generateAuditionNumbers={this.generateAuditionNumbers}
              userOptions={userOptions}
              danceOptions={danceOptions}
            />
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default AdminPage;
