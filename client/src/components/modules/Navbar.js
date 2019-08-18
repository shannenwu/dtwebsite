import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import '../../css/app.css';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    return (
      <div>
        <div id="logo">
          <img src="/site_images/dtlogo-white.png" alt="" />
        </div>
        <div className="item" onClick={() => this.handleItemClick('/')}>
          Home
        </div>
        <div className="item" onClick={() => this.handleItemClick('/about')}>
          About
        </div>
        {userInfo === null ? (
          <div className="item" onClick={() => this.handleItemClick('/login')}>
            Login
          </div>
        ) : (
            <React.Fragment>
              <div className="item" onClick={() => this.handleItemClick('/profile')}>
                Profile
            </div>
              {userInfo.isChoreographer ? (
                <div className="item" onClick={() => this.handleItemClick('/choreographer')}>
                  Choreographer
              </div>
              ) : <div />}
              {userInfo.isAdmin ? (
                <div className="item" onClick={() => this.handleItemClick('/admin')}>
                  Admin
              </div>
              ) : <div />}
              <div className="item" onClick={logout}>
                Logout
            </div>
            </React.Fragment>
          )}
      </div>
    );
  }
}

export default withRouter(NavBar);
