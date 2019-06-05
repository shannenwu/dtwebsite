import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  Grid, Message, Header, Segment, Form, Button,
} from 'semantic-ui-react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showError: false,
      errorMsg: '',
      redirect: false
    };
  }

  handleInputChange = (event) => {
    const { target } = event;
    const { value } = target; 
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      email,
      password,
      errorMsg,
      redirect
    } = this.state;
    if (email === ''|| password === '') {
      this.setState({
        showError: true,
      });
    } else {
      axios.post('/login', {
        email,
        password,
      })
        .then((response) => {
          this.props.loginUser(response.data);
          this.setState({
            showError: false,
            errorMsg: '',
            redirect: true
          });
        })
        .catch((error) => {
          console.log(error.response.data);
          this.setState({
            showError: true,
            errorMsg: error.response.data
          });
        });
    }
  };

  render() {
    const {
      email,
      password,
      showError,
      errorMsg,
      redirect
    } = this.state;
    if (redirect) {
      return <Redirect to='/profile' />
    }
    return (
      <Grid padded centered columns={2}>
        <Grid.Column>
          <Header as="h1">
            Login
          </Header>
          <Segment>
            <Form>
              <Form.Input
                name="email"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Email address"
                onChange={this.handleInputChange}
                value={email}
              />
              <Form.Input
                name="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                autoComplete="off"
                type="password"
                onChange={this.handleInputChange}
                value={password}
              />
              <Button type="submit" onClick={this.handleSubmit} >
              Login
              </Button>
            </Form>
          </Segment>
          <Message>
            Not registered yet?
            {' '}
            <a href="/signup">Sign up!</a>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
