/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Route, Switch, withRouter, Redirect,
} from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import axios from 'axios';
import Home from './pages/static/Home';
import About from './pages/static/About';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Profile from './pages/Profile';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminPage from './pages/AdminPage';
import NavBar from './modules/Navbar';
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
  constructor(props) {
    super(props);

    this.state = {
      userInfo: null,
      loading: true
    };
  }

  componentDidMount() {
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

  getActiveShow = async () => {
    try {
      const response = await axios.get('/api/shows/active');
      return response;
    } catch (e) {
      console.log(e); // TODO FIX LATER
    }
  }

  getDances = async (show_id) => {
    try {
      const response = await axios.get(`/api/dances/${show_id}/all`);
      return response;
    } catch (e) {
      console.log(e); // TODO FIX LATER
    }
  }

  getDanceOptions = (dances) => {
    var danceOptions = dances.map((dance, index) => {
      const names =
        dance.choreographers.map(c => {
          return c.firstName + ' ' + c.lastName
        }).join(', ')
      const levelStyle = dance.level + ' ' + dance.style;
      return {
        key: index,
        text: names + ': ' + levelStyle,
        value: dance._id
      };
    });
    danceOptions.unshift({ key: 100, text: 'No dance selected.', value: '' });
    return danceOptions;
  }

  render() {
    const {
      userInfo,
      loading
    } = this.state;
    if (loading) {
      return (
        <Loader size="massive">Loading</Loader>
      );
    }
    return (
      <div className="wrapper">
        <div className="navbar">
          <NavBar
            userInfo={userInfo}
            logout={this.logout}
          />
        </div>
        <div className="main-content">
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/login" render={props => <Login {...props} loginUser={this.loginUser} />} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/forgot" component={ForgotPassword} />
              <Route exact path="/reset/:resetPasswordToken" component={ResetPassword} />
              <PrivateRoute 
                exact path="/profile" 
                authed={userInfo !== null} 
                loading={loading} 
                userInfo={userInfo}
                getActiveShow={this.getActiveShow}
                getDances={this.getDances}
                getDanceOptions={this.getDanceOptions}
                component={Profile} />
              <PrivateRoute 
                exact path="/admin" 
                authed={userInfo && userInfo.isAdmin} 
                loading={loading}
                userInfo={userInfo} 
                getActiveShow={this.getActiveShow}
                getDances={this.getDances}
                getDanceOptions={this.getDanceOptions}
                component={AdminPage} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
