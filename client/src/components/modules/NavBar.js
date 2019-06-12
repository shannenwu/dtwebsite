import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu, Sidebar } from 'semantic-ui-react';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
    logout: PropTypes.func,
  }

  static defaultProps = {
    userInfo: null,
  }

  render() {
    const {
      userInfo,
      logout,
    } = this.props;
    const {
      visible,
    } = this.state;
    return (
      <div>
        <Menu
          borderless
          fluid
          vertical
          size="large"
        >
          <Menu.Item as={Link} to="/">
            Home
          </Menu.Item>
          <Menu.Item as={Link} to="/about">
            About
          </Menu.Item>
          {userInfo === null ? (
            <Menu.Item as={Link} to="/login">
              Login
            </Menu.Item>
          ) : (
            <React.Fragment>
              <Menu.Item as={Link} to="/profile">
                Profile
              </Menu.Item>
              {userInfo.roles.includes('admin') ? (
                <Menu.Item as={Link} to="/admin">
                  Admin
                </Menu.Item>
              ) : <div />}
              <Menu.Item as="a" to="/logout" onClick={logout}>
                Logout
              </Menu.Item>
            </React.Fragment>
          )}
        </Menu>
      </div>
    );
  }
}

export default NavBar;
