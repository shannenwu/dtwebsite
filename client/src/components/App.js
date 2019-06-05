/* eslint-disable import/no-unresolved */
import React from 'react';
import '../css/app.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Grid, Segment, Loader } from 'semantic-ui-react';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NavBar from './modules/Navbar';
import { Spinner } from './modules/Spinner';
import axios from 'axios';

const PrivateRoute = ({ component: Component, userInfo, loading, ...rest }) => (
    <Route
      {...rest}
      render={(props) => userInfo !== null && !loading
        ? <Component {...props} userInfo={userInfo} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
)

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
      loading: false
    });
  }

  logout = () => {
    this.setState({
      userInfo: null,
    });
  };

  getUser = () => {
    axios.get('/api/whoami')
      .then(
        (response) => {
          var userObj = response.data;
          if (userObj._id !== undefined) {
            this.setState({
              userInfo: userObj,
              loading: false
            });
          } else {
            this.setState({
              userInfo: null,
              loading: false
            });
          }
        },
      );
  }


  render() {
    const {
      userInfo,
      loading
    } = this.state;
    if (loading) {
      return (
        <Loader size='massive'>Loading</Loader>
      )
    }
    return (
      <div>
        <Grid padded>
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
                <Route exact path='/login' render={(props) => <Login {...props} loginUser={this.loginUser} />}/>
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/forgot" component={ForgotPassword} />
                <Route exact path="/reset/:resetPasswordToken" component={ResetPassword} />
                <PrivateRoute userInfo={userInfo} loading={loading} path='/profile' component={Profile} />
                <Redirect from='/logout' to='/login'/>
              </Switch>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withRouter(App);
