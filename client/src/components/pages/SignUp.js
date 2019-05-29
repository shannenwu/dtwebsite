import React from "react";
import { Button, Form, Container, Header, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class SignUp extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        messageFromServer: '',
        showError: false,
        registerError: false,
        loginError: false,
      };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value; // make conditional based on type of input
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      password,
      email
    } = this.state;
    if (firstName === '' || lastName === '' || password === '' || email === '') {
      this.setState({
        showError: true,
        loginError: false,
        registerError: true,
      });
    } else {
      axios.post('/signup', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password
      })
      .then((response) => {
        console.log(response.data.message);
        this.setState({
          messageFromServer: response.data.message,
          showError: false,
          loginError: false,
          registerError: false,
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data === 'email already taken') {
          this.setState({
            showError: true,
            loginError: true,
            registerError: false,
          });
        }
      });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      password,
      email,
      messageFromServer,
      showError,
      registerError,
      loginError
    } = this.state;
    if (messageFromServer === '') {
      return (
        <Container>
          <Header as="h1">
            Create an Account
          </Header>
          <Form>
            <Form.Field required>
              <label>First Name</label>
              <input 
                name='firstName'
                placeholder='First Name' 
                onChange={this.handleInputChange}
                value={firstName}
                />
            </Form.Field>
            <Form.Field required>
              <label>Last Name</label>
              <input 
                name='lastName'
                placeholder='Last Name' 
                onChange={this.handleInputChange}
                value={lastName}
                />
            </Form.Field>
            <Form.Field required> 
              <label>Email</label>
              <input 
                name='email'
                placeholder='Email' 
                onChange={this.handleInputChange}
                value={email}
                />
            </Form.Field>
            <Form.Field required>
              <label>Password</label>
              <input 
                name='password'
                placeholder='Password' 
                onChange={this.handleInputChange}
                value={password}
                autoComplete="off"
                type="password"
                />
            </Form.Field>
            <Button type='submit' onClick={this.handleSubmit}>Register</Button>
          </Form>
          {showError === true && registerError === true && (
            <Message
            error
            header='Action Forbidden'
            content='Please fill in all required fields.'
          />
          )}
          {showError === true && loginError === true && (
            <div>
              <Message
                error
                header='Action Forbidden'
                content='Email already registered. Please choose another email or login.'
              />
              <Button as={Link} to='/login'>Login</Button>
            </div>
          )}
        </Container>
      );
    } else if (messageFromServer === 'user created') {
      return (
        <div>
          <Header as="h1">
          User successfully registered!
          </Header>
          <Button as={Link} to='/login'>Login</Button>
        </div>
      );
    }
  }
}

export default SignUp;
