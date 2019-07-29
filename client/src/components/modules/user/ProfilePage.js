import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Header, Menu, Dimmer, Loader, Label, Popup,
} from 'semantic-ui-react';
import UserInfo from './UserInfo';
import PrefsheetInfo from './PrefsheetInfo';
import ConflictsInfo from './ConflictsInfo';

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'personal',
      prefData: {
        maxDances: -1,
        rankedDances: [],
        danceOptions: [],
      },
      activeShow: null,
      messageFromServer: '',
      errorMsg: [],
      loading: true,
    };
  }

  static propTypes = {
    userInfo: PropTypes.object.isRequired,
    getActiveShow: PropTypes.func.isRequired,
    getDances: PropTypes.func.isRequired,
    getDanceOptions: PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.title = 'User Profile';
    this.getPrefsheet();
  }

  getPrefsheet = async () => {
    const {
      userInfo,
      getActiveShow,
      getDances,
      getDanceOptions,
    } = this.props;

    try {
      const activeShowResponse = await getActiveShow();
      const activeShow = activeShowResponse.data;

      const [prefResponse, dancesResponse] = await Promise.all([
        axios.get(`/api/prefsheets/user/${userInfo._id}`),
        getDances(activeShow._id),
      ]);

      const prefsheet = prefResponse.data;
      const danceOptions = getDanceOptions(dancesResponse.data);

      if (prefsheet.rankedDances) {
        const filledRankedDances = prefsheet.rankedDances
          .concat(Array(danceOptions.length - prefsheet.rankedDances.length)
            .fill({ dance: '' }));
        var prefData = {
          ...this.state.prefData,
          maxDances: prefsheet.maxDances,
          rankedDances: filledRankedDances,
          danceOptions,
        };
      } else {
        var prefData = {
          ...this.state.prefData,
          maxDances: -1,
          rankedDances: Array(danceOptions.length).fill({ dance: '' }),
          danceOptions,
        };
      }
      this.setState({ activeShow, prefData, loading: false });
    } catch (e) {
      console.log(e); // TODO ERROR HANDLE
    }
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({
      prefData: {
        ...this.state.prefData,
        [name]: value,
      },
    });
  }

  handleListChange = (e, { name, value }) => {
    const { rankedDances } = this.state.prefData;
    const copy = [...rankedDances];
    copy[name] = { dance: value };
    this.setState({
      prefData: {
        ...this.state.prefData,
        rankedDances: copy,
      },
    });
  }

  handleItemClick = (event, { name }) => this.setState({ activeItem: name })

  handleDismiss = () => {
    this.setState({
      messageFromServer: '',
      errorMsg: [],
    });
  }

  handleSubmit = (event) => {
    const {
      prefData,
    } = this.state;
    const {
      userInfo,
    } = this.props;
    event.preventDefault();

    axios.post(`/api/prefsheets/user/${userInfo._id}`, {
      maxDances: prefData.maxDances,
      rankedDances: prefData.rankedDances,
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
            errorMsg: msgList,
          });
        } else {
          // other bad errors
          this.setState({
            errorMsg: [error.response.data],
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
      loading,
    } = this.state;
    const { userInfo } = this.props;
    let tab = <UserInfo userInfo={userInfo} />;

    if (activeItem === 'personal') {
      tab = <UserInfo userInfo={userInfo} />;
    } else if (activeItem === 'prefs') {
      tab = (
        <PrefsheetInfo
          prefData={prefData}
          activeShow={activeShow}
          handleInputChange={this.handleInputChange}
          handleListChange={this.handleListChange}
          handleSubmit={this.handleSubmit}
          handleDismiss={this.handleDismiss}
          messageFromServer={messageFromServer}
          errorMsg={errorMsg}
        />
      );
    } else if (activeItem === 'conflicts') {
      tab = <ConflictsInfo />;
    }

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }
    return (
      <div id="profile">
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
          {activeShow.prefsOpen && (
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
                <Popup
                  content="Please fill out your weekly availabilities for rehearsal times!"
                  trigger={<Label circular color="red" size="mini" floating content="!" />}
                />
              </Menu.Item>
            </React.Fragment>
          )}
        </Menu>
        {tab}
      </div>
    );
  }
}

export default ProfilePage;
