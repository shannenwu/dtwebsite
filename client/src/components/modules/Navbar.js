import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import './navbar.css';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
    logout: PropTypes.func.isRequired,
    showBg: PropTypes.bool,
  }

  static defaultProps = {
    userInfo: null,
    showBg: false
  }

  toggleMenu = () => {
    const { open } = this.state;
    this.setState({
      open: !open
    });
  }

  handleItemClick = (path) => {
    this.props.history.push(path);
    this.setState({
      open: false
    })
  }

  render() {
    const { open } = this.state;
    const {
      userInfo,
      logout,
      showBg
    } = this.props;
    return (
      <nav className={showBg ? 'navbar' : 'navbar dark'}>
        <span className='navbar-toggle' id='js-navbar-toggle' onClick={() => this.toggleMenu()}>
          <Icon name={open ? 'times' : 'bars'} />
        </span>
        <div className='logo' onClick={() => this.handleItemClick('/')}>
          <img src={showBg ? '/site_images/dtlogo-white.png' : '/site_images/dtlogo-black.png'} alt='' />
        </div>
        <ul className={open ? 'main-nav active' : 'main-nav'} id='js-menu'>
          <li>
            <div className='nav-links' onClick={() => this.handleItemClick('/about')}>
              ABOUT
            </div>
          </li>
          <li>
            <div className='nav-links' onClick={() => this.handleItemClick('/officers')}>
              OFFICERS
            </div>
          </li>
          <li>
            <div className='nav-links' onClick={() => this.handleItemClick('/auditions')}>
              AUDITIONS
            </div>
          </li>
          <li>
            <div className='nav-links' onClick={() => this.handleItemClick('/shows')}>
              SHOWS
            </div>
          </li>
          {userInfo === null ? (
            <li>
              <div className='nav-links' onClick={() => this.handleItemClick('/login')}>
                Login
              </div>
            </li>
          ) : (
              <React.Fragment>
                <li>
                  <div className='nav-links' onClick={() => this.handleItemClick('/profile')}>
                    PROFILE
                  </div>
                </li>
                <li>
                  <div className='nav-links' onClick={logout}>
                    LOGOUT
                  </div>
                </li>
              </React.Fragment>
            )}
        </ul>
      </nav>
    );
  }
}

export default withRouter(NavBar);
