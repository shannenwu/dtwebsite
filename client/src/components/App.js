import React from 'react';
import '../css/app.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Grid, Segment } from 'semantic-ui-react';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NavBar from './modules/Navbar';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: null,
    };
  }

  componentDidMount() {
    // this.getUser();
  }

  logout = () => {
    this.setState({
      userInfo: null,
    });
  };

  getUser = () => {
    fetch('/api/whoami')
      .then(res => res.json())
      .then(
        (userObj) => {
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
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={SignUp} />
              </Switch>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withRouter(App);
