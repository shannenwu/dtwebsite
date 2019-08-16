import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../css/app.css';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
    logout: PropTypes.func.isRequired,
  }

  static defaultProps = {
    userInfo: null,
  }

  handleItemClick = (path) => {
    this.props.history.push(path);
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
        <div id="logo">
          <img src="/site_images/dtlogo-white.png" alt="" />
        </div>
        <div className="item">
          <Link to="/">
            Home
          </Link>
        </div>
        <div className="item">
          <Link to="/about">
            About
          </Link>
        </div>
        {userInfo === null ? (
          <div className="item">
            <Link to="/login">
              Login
            </Link>
          </div>
        ) : (
          <React.Fragment>
            <div className="item">
              <Link to="/profile">
                  Profile
              </Link>
            </div>
            {userInfo.isChoreographer ? (
              <div className="item">
                <Link to="/choreographer">
                    Choreographer
                </Link>
              </div>
            ) : <div />}
            {userInfo.isAdmin ? (
              <div className="item">
                <Link to="/admin">
                    Admin
                </Link>
              </div>
            ) : <div />}
            <div className="item" onClick={logout}>
              <Link to="/logout">
                  Logout
              </Link>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default NavBar;
