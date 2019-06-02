import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static propTypes = {
    userInfo: PropTypes.objectOf(PropTypes.string),
  }

  static defaultProps = {
    userInfo: null,
  }

  render() {
    const {
      userInfo,
    } = this.props;
    return (
      <Menu borderless fluid vertical size="large">
        <Menu.Item as={Link} to="/">
                    Home
        </Menu.Item>
        <Menu.Item as={Link} to="/about">
                    About
        </Menu.Item>
        { userInfo === null ? (
          <Menu.Item as={Link} to="/login">
                        Login
          </Menu.Item>
        ) : (
          <Menu.Item as={Link} to="/logout">
                        Logout
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

export default NavBar;
