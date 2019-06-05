/* eslint-disable import/no-unresolved */
import React from 'react';
import '../css/app.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Grid, Segment } from 'semantic-ui-react';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import NavBar from './modules/Navbar';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: null,
    };
  }

  componentDidMount() {
    this.getUser();
  }

  loginUser = (userObj) => {
    this.setState({
      userInfo: userObj,
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
            });
          } else {
            this.setState({
              userInfo: null,
            });
          }
        },
      );
  }

  render() {
    const {
      userInfo,
    } = this.state;
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
                <Route exact path='/profile' render={(props) => <Profile {...props} userInfo={userInfo} />} />
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
