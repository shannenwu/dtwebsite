import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import {
  Button, Dimmer, Grid, Form, Header, Input, Loader, Message, Segment
} from 'semantic-ui-react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMsg: [],
      redirect: false,
      loading: false,
    };
  }

  static propTypes = {
    loginUser: PropTypes.func.isRequired,
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

    this.setState({
      loading: true,
    });

    axios.post('/login', {
      email,
      password,
    })
      .then((response) => {
        loginUser(response.data);
        this.setState({
          errorMsg: [],
          redirect: true,
          loading: false,
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
            errorMsg: msgList,
            loading: false,
          });
        } else {
          // bad email or password errors
          this.setState({
            errorMsg: [error.response.data],
            loading: false,
          });
        }
      });
  };

  render() {
    const {
      email,
      password,
      errorMsg,
      redirect,
      loading,
    } = this.state;
    if (redirect) {
      return <Redirect to='/profile' />;
    }
    return (
      <Grid padded centered>
        <Dimmer active={loading} inverted>
          <Loader />
        </Dimmer>
        <Grid.Column width={8}>
          <Header
            as='h1'
            content='Welcome Back!'
            style={{ textAlign: 'center' }}
          />
          <Segment>
            <Form>
              <Form.Field>
                <label>Email</label>
                <Input
                  name='email'
                  onChange={this.handleChange}
                  value={email}
                />
              </Form.Field>
              <Form.Field style={{ marginBottom: '0em' }}>
                <label>Password</label>
                <Input
                  name='password'
                  autoComplete='off'
                  type='password'
                  onChange={this.handleChange}
                  value={password}
                />
              </Form.Field>
              <div style={{ marginBottom: '1em' }}>
                <Link to='/forgot'>Forgot your password?</Link>
              </div>
              <Button type='submit' onClick={this.handleSubmit} fluid color='blue'>
                Login
              </Button>
            </Form>
            {errorMsg.length !== 0 && (
              <Message
                error
                header='Please fix the following and try again.'
                list={errorMsg}
              />
            )}
          </Segment>
          <Message
            style={{ textAlign: 'center' }}
          >
            Need an account?
            {' '}
            <Link to='/signup'>Sign up!</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
