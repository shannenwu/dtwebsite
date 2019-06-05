import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class NavBar extends Component {
  constructor(props) {
    super(props);
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
      logout
    } = this.props;
    return (
      <div>
        <Menu borderless fluid vertical size="large">
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
              <Menu.Item as={Link} to="/logout" onClick={logout}>
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
