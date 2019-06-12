import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Header, Menu, Grid,
} from 'semantic-ui-react';
import UserInfo from '../modules/UserInfo';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'personal',
    };
  }

  static propTypes = {
    userInfo: PropTypes.objectOf(PropTypes.shape()),
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    document.title = 'User Profile';
  }

  handleItemClick = (event, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state;
    const { userInfo } = this.props;
    let tab = <UserInfo userInfo={userInfo} />;
    if (activeItem === 'personal') {
      tab = <UserInfo userInfo={userInfo} />;
    } else if (activeItem === 'prefs') {
      tab = <div>PREFS</div>;
    } else if (activeItem === 'conflicts') {
      tab = <div>CONFLICTS</div>;
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
          </Menu>
          {tab}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Profile;
