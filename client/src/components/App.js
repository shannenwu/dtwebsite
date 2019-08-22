import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';
import Home from './pages/static/Home';
import About from './pages/static/About';
import Auditions from './pages/static/Auditions';
import Officers from './pages/static/Officers';
import Shows from './pages/static/Shows';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import AdminPage from './modules/admin/AdminPage';
import AllPrefsheets from './modules/admin/settings/AllPrefsheets';
import ProfilePage from './modules/user/ProfilePage';
import ChoreographerPage from './modules/choreographer/ChoreographerPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NavBar from './modules/Navbar';
import DancerSelection from './modules/choreographer/dancer-selection/DancerSelection';
import TimeSelection from './modules/choreographer/time/TimeSelection';
import DancerList from './modules/choreographer/dancer-list/DancerList';
import '../css/app.css';

const PrivateRoute = ({
  component: Component, authed, loading, ...rest
}) => (
    <Route
      {...rest}
      render={(props) => {
        if (authed && !loading) {
          return <Component {...props} {...rest} />;
        }
        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      }
      }
    />
  );

class App extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io(`http://${window.location.hostname}:3000`);

    this.state = {
      userInfo: null,
      loading: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUser();

    this.socket.on('updated user', (userObj) => {
      this.setState({
        userInfo: userObj
      })
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    this.getUser();
  }

  loginUser = (userObj) => {
    this.setState({
      userInfo: userObj,
      loading: false,
    });
  }

  logout = () => {
    axios.get('/logout')
      .then(
        (response) => {
          if (!response.data.authenticated) {
            this.setState({
              userInfo: null,
            });
          } else {
            console.log('error logging out user');
          }
        },
      );
  };

  getUser = () => {
    axios.get('/api/whoami')
      .then(
        (response) => {
          const userObj = response.data;
          if (userObj._id !== undefined) {
            this.setState({
              userInfo: userObj,
              loading: false,
            });
          } else {
            this.setState({
              userInfo: null,
              loading: false,
            });
          }
        },
      );
  }

  // TODO error handle for the following functions.
  getActiveShow = async () => {
    try {
      const response = await axios.get('/api/shows/active');
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  getDances = async (showId) => {
    try {
      const response = await axios.get(`/api/dances/${showId}/all`);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  getSingleDance = async (danceId) => {
    try {
      const danceResponse = await axios.get(`/api/dances/${danceId}`);
      return danceResponse;
    } catch (e) {
      console.log(e);
    }
  }

  getDanceOptions = (dances) => {
    const danceOptions = dances.map((dance, index) => {
      var name = `${dance.name}: ${dance.level} ${dance.style}`;
      name = name.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
      return {
        key: index,
        text: name,
        value: dance._id,
      };
    });
    danceOptions.unshift({ key: 100, text: 'No dance selected.', value: '' });
    return danceOptions;
  }

  render() {
    const {
      userInfo,
      loading,
    } = this.state;
    if (loading) {
      return (
        <Loader size='massive' content='Loading' />
      );
    }
    return (
      <div className='wrapper'>
        <NavBar
          userInfo={userInfo}
          logout={this.logout}
        />
        <div className='main-content'>
          <div className='container'>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/about' component={About} />
              <Route exact path='/auditions' component={Auditions} />
              <Route exact path='/officers' component={Officers} />
              <Route exact path='/shows' component={Shows} />
              <Route exact path='/login' render={props => <Login {...props} loginUser={this.loginUser} />} />
              <Route exact path='/signup' component={SignUp} />
              <Route exact path='/forgot' component={ForgotPassword} />
              <Route exact path='/reset/:resetPasswordToken' component={ResetPassword} />
              <Redirect from='/logout' to='/' />
              <PrivateRoute
                exact
                path='/profile'
                authed={userInfo !== null}
                loading={loading}
                userInfo={userInfo}
                getActiveShow={this.getActiveShow}
                getDances={this.getDances}
                getDanceOptions={this.getDanceOptions}
                component={ProfilePage}
              />
              <PrivateRoute
                exact
                path='/choreographer'
                authed={userInfo && (userInfo.isChoreographer || userInfo.isAdmin)}
                loading={loading}
                userInfo={userInfo}
                getActiveShow={this.getActiveShow}
                getDances={this.getDances}
                component={ChoreographerPage}
              />
              <PrivateRoute
                exact
                path='/selection/:danceId'
                authed={userInfo && (userInfo.isChoreographer || userInfo.isAdmin)}
                loading={loading}
                userInfo={userInfo}
                getSingleDance={this.getSingleDance}
                component={DancerSelection}
              />
              <PrivateRoute
                exact
                path='/time/:danceId'
                authed={userInfo && (userInfo.isChoreographer || userInfo.isAdmin)}
                loading={loading}
                userInfo={userInfo}
                getSingleDance={this.getSingleDance}
                component={TimeSelection}
              />
              <PrivateRoute
                exact
                path='/list/:danceId'
                authed={userInfo && (userInfo.isChoreographer || userInfo.isAdmin)}
                loading={loading}
                userInfo={userInfo}
                component={DancerList}
              />
              <PrivateRoute
                exact
                path='/admin'
                authed={userInfo && userInfo.isAdmin}
                loading={loading}
                userInfo={userInfo}
                getActiveShow={this.getActiveShow}
                getDances={this.getDances}
                getDanceOptions={this.getDanceOptions}
                component={AdminPage}
              />
              <PrivateRoute
                exact
                path='/all-prefsheets'
                authed={userInfo && userInfo.isAdmin}
                loading={loading}
                userInfo={userInfo}
                component={AllPrefsheets}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
