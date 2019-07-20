import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Header, Menu, Grid, Dimmer, Loader
} from 'semantic-ui-react';
import UserInfo from '../modules/user/UserInfo';
import PrefsheetInfo from '../modules/user/PrefsheetInfo';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'personal',
      prefData: {
        maxDances: -1,
        rankedDances: [],
        danceOptions: []
      },
      activeShow: null,
      messageFromServer: '',
      errorMsg: [],
      loading: true
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    document.title = 'User Profile';
    this.getPrefsheet();
  }

  getActiveShow = async () => {
    try {
      const response = await axios.get('/api/shows/active');
      return response.data;
    } catch (e) {
      console.log(e); // TODO FIX LATER
    }
  }

  getPrefsheet = async () => {
    const {
      userInfo,
    } = this.props;

    try {
      const activeShow = await this.getActiveShow();

      const [prefResponse, danceResponse] = await Promise.all([
        axios.get(`/api/prefsheets/user/${userInfo._id}?show_id=${activeShow._id}`),
        axios.get(`/api/dances/${activeShow._id}/all`)
      ]);

      const prefsheet = prefResponse.data;
      const danceOptions = this.getDanceOptions(danceResponse.data);

      if (prefsheet.rankedDances) {
        const filledRankedDances =
          prefsheet.rankedDances.concat(Array(danceOptions.length - prefsheet.rankedDances.length)
            .fill({ dance: '' }))
        var prefData = {
          ...this.state.prefData,
          maxDances: prefsheet.maxDances,
          rankedDances: filledRankedDances,
          danceOptions: danceOptions
        }
      } else {
        var prefData = {
          ...this.state.prefData,
          maxDances: -1,
          rankedDances: Array(danceOptions.length).fill({ dance: '' }),
          danceOptions: danceOptions
        }
      }
      this.setState({ activeShow, prefData, loading: false });
    } catch (e) {
      console.log(e); // TODO ERROR HANDLE
    }
  }

  getDanceOptions = (dances) => {
    var danceOptions = dances.map((dance, index) => {
      const names =
        dance.choreographers.map(c => {
          return c.firstName + ' ' + c.lastName
        }).join(', ')
      const levelStyle = dance.level + ' ' + dance.style;
      return {
        key: index,
        text: names + ': ' + levelStyle,
        value: dance._id
      };
    });
    danceOptions.unshift({ key: 100, text: 'No dance selected.', value: '' });
    return danceOptions;
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({
      prefData: {
        ...this.state.prefData,
        [name]: value
      }
    });
  }

  handleListChange = (e, { name, value }) => {
    const { rankedDances } = this.state.prefData;
    const copy = [...rankedDances];
    copy[name] = { dance: value }
    this.setState({
      prefData: {
        ...this.state.prefData,
        rankedDances: copy
      }
    });
  }

  handleItemClick = (event, { name }) => this.setState({ activeItem: name })

  handleDismiss = () => {
    this.setState({
      messageFromServer: '',
      errorMsg: []
    });
  }

  handleSubmit = (event) => {
    const {
      prefData,
      activeShow
    } = this.state;
    const {
      userInfo
    } = this.props;
    event.preventDefault();

    axios.post(`/api/prefsheets/user/${userInfo._id}`, {
      show: activeShow,
      maxDances: prefData.maxDances,
      rankedDances: prefData.rankedDances
    })
      .then((response) => {
        this.setState({
          messageFromServer: response.data.message,
          errorMsg: [],
        });
      })
      .catch((error) => {
        if (error.response.data.errors !== undefined) {
          // form validation errors
          const msgList = [];
          error.response.data.errors.forEach((element) => {
            msgList.push(element.msg);
          });
          this.setState({
            errorMsg: msgList
          });
        } else {
          // other bad errors
          this.setState({
            errorMsg: [error.response.data]
          });
        }
      });
  };


  render() {
    const {
      activeItem,
      prefData,
      activeShow,
      messageFromServer,
      errorMsg,
      loading
    } = this.state;
    const { userInfo } = this.props;
    let tab = <UserInfo userInfo={userInfo} />;

    if (activeItem === 'personal') {
      tab = <UserInfo userInfo={userInfo} />;
    } else if (activeItem === 'prefs') {
      tab = <PrefsheetInfo
        userInfo={userInfo}
        prefData={prefData}
        activeShow={activeShow}
        handleInputChange={this.handleInputChange}
        handleListChange={this.handleListChange}
        handleSubmit={this.handleSubmit}
        handleDismiss={this.handleDismiss}
        messageFromServer={messageFromServer}
        errorMsg={errorMsg}
      />;
    } else if (activeItem === 'conflicts') {
      tab = <div>CONFLICTS</div>;
    }

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader></Loader>
        </Dimmer>
      );
    }
    return (
      <Grid padded columns={1}>
        <Grid.Column>
          <Header as="h1">
            {`${userInfo.firstName} ${userInfo.lastName}`}
          </Header>
          <Menu tabular pointing secondary stackable>
            <Menu.Item
              name="personal"
              active={activeItem === 'personal'}
              onClick={this.handleItemClick}
            >
              Personal Information
            </Menu.Item>
            {activeShow.prefsOpen ? (
              <React.Fragment>
                <Menu.Item
                  name="prefs"
                  active={activeItem === 'prefs'}
                  onClick={this.handleItemClick}
                >
                  Dance Preferences
                </Menu.Item>
                <Menu.Item
                  name="conflicts"
                  active={activeItem === 'conflicts'}
                  onClick={this.handleItemClick}
                >
                  Practice Availabilities
                </Menu.Item>
              </React.Fragment>) : <div></div>}
          </Menu>
          {tab}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Profile;