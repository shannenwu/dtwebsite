import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import {
  Grid, Message, Header, Segment, Form, Button, Container, Input,
} from 'semantic-ui-react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showError: false,
      errorMsg: [],
      redirect: false,
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      email,
      password,
    } = this.state;
    const {
      loginUser,
    } = this.props;

    axios.post('/login', {
      email,
      password,
    })
      .then((response) => {
        loginUser(response.data);
        this.setState({
          showError: false,
          errorMsg: [],
          redirect: true,
        });
      })
      .catch((error) => {
        if (error.response.data.errors !== undefined) {
          // form validation errors
          const msgList = [];
          error.response.data.errors.forEach((element) => {
            msgList.push(element.msg);
          });
          this.setState({
            showError: true,
            errorMsg: msgList,
          });
        } else {
          // bad email or password errors
          this.setState({
            showError: true,
            errorMsg: [error.response.data],
          });
        }
      });
  };

  render() {
    const {
      email,
      password,
      showError,
      errorMsg,
      redirect,
    } = this.state;
    if (redirect) {
      return <Redirect to="/profile" />;
    }
    return (
      <Grid padded centered columns={2}>
        <Grid.Column>
          <Header as="h1">
            Welcome Back!
          </Header>
          <Segment>
            <Form>
              <Form.Field>
                <label>Email</label>
                <Input
                  name="email"
                  onChange={this.handleChange}
                  value={email}
                />
              </Form.Field>
              <Form.Field style={{ marginBottom: '0em' }}>
                <label>Password</label>
                <Input
                  name="password"
                  autoComplete="off"
                  type="password"
                  onChange={this.handleChange}
                  value={password}
                />
              </Form.Field>
              <Container as={Link} to="/forgot" style={{ marginBottom: '1em' }}>Forgot your password?</Container>
              <Button type="submit" onClick={this.handleSubmit} fluid color="blue">
              Login
              </Button>
            </Form>
            {showError === true && errorMsg.length !== 0 && (
              <Message
                error
                header="Please fix the following and try again."
                list={errorMsg}
              />
            )}
          </Segment>
          <Message>
            Need an account?
            {' '}
            <a href="/signup">Sign up!</a>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
