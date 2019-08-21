import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './navbar.css';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPath: null
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
    this.setState({
      selectedPath: path 
    });
    this.props.history.push(path);
  }

  render() {
    const { selectedPath } = this.state;
    const {
      userInfo,
      logout,
    } = this.props;
    return (
      <div id='navbar'>
        <div id='logo' onClick={() => this.handleItemClick('/')}>
          <img src='/site_images/dtlogo-white.png' alt='' />
        </div>
        <div className={selectedPath === '/about' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/about')}>
          About
        </div>
        <div className={selectedPath === '/announcements' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/announcements')}>
          Announcements
        </div>
        <div className={selectedPath === '/officers' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/officers')}>
          Officers
        </div>
        <div className={selectedPath === '/auditions' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/auditions')}>
          Auditions
        </div>
        <div className={selectedPath === '/shows' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/shows')}>
          Shows
        </div>
        <div className={selectedPath === '/workshops' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/workshops')}>
          Workshops
        </div>
        {userInfo === null ? (
          <div className='item' onClick={() => this.handleItemClick('/login')}>
            Login
          </div>
        ) : (
            <React.Fragment>
              <div className={selectedPath === '/profile' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/profile')}>
                Profile
            </div>
              {userInfo.isAdmin || userInfo.isChoreographer ? (
                <div  className={selectedPath === '/choreographer' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/choreographer')}>
                  Choreographer
              </div>
              ) : <div />}
              {userInfo.isAdmin ? (
                <div className={selectedPath === '/admin' ? 'item selected': 'item'} onClick={() => this.handleItemClick('/admin')}>
                  Admin
              </div>
              ) : <div />}
              <div className='item' onClick={logout}>
                Logout
            </div>
            </React.Fragment>
          )}
      </div>
    );
  }
}

export default withRouter(NavBar);
