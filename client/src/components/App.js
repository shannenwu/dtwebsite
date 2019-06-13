/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Route, Switch, withRouter, Redirect,
} from 'react-router-dom';
import { Grid, Segment, Loader } from 'semantic-ui-react';
import axios from 'axios';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminPage from './pages/AdminPage';
import NavBar from './modules/Navbar';
import '../css/app.css';

const PrivateRoute = ({
  component: Component, authed, userInfo, loading, ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (authed && !loading) {
        return <Component {...props} userInfo={userInfo} />;
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
      loading: true,
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


  render() {
    const {
      userInfo,
      loading,
    } = this.state;
    if (loading) {
      return (
        <Loader size="massive">Loading</Loader>
      );
    }
    return (
      <div>
        <Grid stretched padded style={{ height: '100vh' }}>
          <Grid.Column width={3}>
            <NavBar
              userInfo={userInfo}
              logout={this.logout}
            />
          </Grid.Column>
          <Grid.Column width={13}>
            <Segment>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/login" render={props => <Login {...props} loginUser={this.loginUser} />} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/forgot" component={ForgotPassword} />
                <Route exact path="/reset/:resetPasswordToken" component={ResetPassword} />
                <PrivateRoute path="/profile" authed={userInfo!==null} userInfo={userInfo} loading={loading} component={Profile} />
                <PrivateRoute exact path="/admin" authed={userInfo && userInfo.isAdmin} userInfo={userInfo} loading={loading} component={AdminPage} />
              </Switch>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withRouter(App);
