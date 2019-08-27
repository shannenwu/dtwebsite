import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Dimmer, Header, Icon, Label, Loader, Menu, Popup
} from 'semantic-ui-react';
import UserInfo from './UserInfo';
import PrefsheetInfo from './PrefsheetInfo';
import ConflictsInfo from './ConflictsInfo';
import './user.css';

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
      conflicts: [],
      conflictsDescription: '',
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

      if (prefsheet) {
        var conflicts = prefsheet.weeklyConflicts;
        var conflictsDescription = prefsheet.weeklyDescription;

        // Reset depending on prod or weekly conflicts.
        if (activeShow.prodConflictsOpen) {
          conflicts = prefsheet.prodConflicts;
          conflictsDescription = prefsheet.prodDescription;
        }
      } else {
        conflicts = [];
        conflictsDescription = ''
      }

      this.setState({
        activeShow,
        prefData,
        conflicts,
        conflictsDescription,
        loading: false
      });
    } catch (e) {
      console.log(e); // TODO ERROR HANDLE
    }
  }

  handleInputPrefChange = (e, { name, value }) => {
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

  handleInputConflictsChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  handleScheduleChange = (newSchedule) => {
    this.setState({
      conflicts: newSchedule
    });
  }

  handleItemClick = (event, { name }) => this.setState({ activeItem: name })

  handleDismiss = () => {
    this.setState({
      messageFromServer: '',
      errorMsg: [],
    });
  }

  handleSubmitConflicts = (event) => {
    const {
      conflicts,
      conflictsDescription
    } = this.state;
    const {
      userInfo,
    } = this.props;
    event.preventDefault();

    axios.post(`/api/prefsheets/user/conflicts/${userInfo._id}`, {
      conflicts,
      conflictsDescription
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
      conflicts,
      conflictsDescription,
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
          handleInputChange={this.handleInputPrefChange}
          handleListChange={this.handleListChange}
          handleSubmit={this.handleSubmit}
          handleDismiss={this.handleDismiss}
          messageFromServer={messageFromServer}
          errorMsg={errorMsg}
        />
      );
    } else if (activeItem === 'conflicts') {
      tab = (
        <ConflictsInfo
          isProd={activeShow.prodConflictsOpen}
          conflicts={conflicts}
          conflictsDescription={conflictsDescription}
          handleScheduleChange={this.handleScheduleChange}
          handleInputChange={this.handleInputConflictsChange}
          handleSubmitConflicts={this.handleSubmitConflicts}
          handleDismiss={this.handleDismiss}
          messageFromServer={messageFromServer}
          errorMsg={errorMsg}
        />
      );
    }

    if (loading) {
      return (
        <Dimmer active inverted className='profile-loader'>
          <Loader content='Loading profile...' />
        </Dimmer>
      );
    }
    return (
      <div id='profile'>
        <Header as='h1'>
          {`${userInfo.firstName} ${userInfo.lastName}`}
          {(userInfo.isChoreographer || userInfo.isAdmin) &&
            <Label className='role-label' color='teal' horizontal as={Link} to='/choreographer'>
              Choreographer
            </Label>}
          {userInfo.isAdmin &&
            <Label className='role-label' color='violet' horizontal as={Link} to='/admin'>
              Admin
            </Label>}
        </Header>
        <Menu tabular pointing secondary>
          <Menu.Item
            name='personal'
            active={activeItem === 'personal'}
            onClick={this.handleItemClick}
          >
            <Icon name='user circle' />
            <div className='tab-label'>Dancer Info</div>
          </Menu.Item>
          {activeShow.prefsOpen && (
            <React.Fragment>
              <Menu.Item
                name='prefs'
                active={activeItem === 'prefs'}
                onClick={this.handleItemClick}
              >
                <Icon name='list ol' />
                <div className='tab-label'>Dance Preferences</div>
              </Menu.Item>
              <Menu.Item
                name='conflicts'
                active={activeItem === 'conflicts'}
                onClick={this.handleItemClick}
              >
                <Icon name='calendar alternate outline' />
                <div className='tab-label'>Practice Conflicts</div>
                {!conflicts.length && prefData.rankedDances.length &&
                  <Popup
                    content='Please fill out your weekly availabilities for rehearsal times!'
                    trigger={<Label circular color='red' size='mini' floating content='!' />}
                  />}
              </Menu.Item>
            </React.Fragment>
          )}
          {activeShow.prodConflictsOpen &&
            <Menu.Item
              name='conflicts'
              active={activeItem === 'conflicts'}
              onClick={this.handleItemClick}
            >
              <Icon name='calendar alternate outline' />
              Prod Week Conflicts
                {!conflicts.length &&
                <Popup
                  content='Please fill out your prod week availabilities!'
                  trigger={<Label circular color='red' size='mini' floating content='!' />}
                />}
            </Menu.Item>}
        </Menu>
        {tab}
      </div>
    );
  }
}

export default ProfilePage;
