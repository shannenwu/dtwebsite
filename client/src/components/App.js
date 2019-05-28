import React from "react";
import "../css/app.css";
import { Route, Switch, withRouter } from 'react-router-dom';
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NavBar from "./modules/Navbar.js";
import { Grid } from 'semantic-ui-react';

class App extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          userInfo: null
      };
  }

  componentDidMount() {
    // this.getUser();
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Column width={3}>
            <NavBar
              userInfo={this.state.userInfo}
              logout={this.logout}
            />
          </Grid.Column>
          <Grid.Column width={13}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    )
    ;
  }

  logout = () => {
    this.setState({
        userInfo: null
    })
  };

  getUser = () => {    
    fetch('/api/whoami')
    .then(res => res.json())
    .then(
        userObj => {
            if (userObj._id !== undefined) {
                this.setState({ 
                    userInfo: userObj
                });
            } else {
                this.setState({ 
                    userInfo: null
                });
            }
        }
    );
  }
}

export default withRouter(App);