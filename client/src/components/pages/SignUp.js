import React from 'react';
import {
  Button, Form, Container, Header, Message,
} from 'semantic-ui-react';
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
      errorMsg: []
    };
  }

  handleInputChange = (event) => {
    const { target } = event;
    const { value } = target; // make conditional based on type of input
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      password,
      email,
      errorMsg,
    } = this.state;
    if (firstName === '' || lastName === '' || password === '' || email === '') {
      this.setState({
        showError: true,
        registerError: true,
      });
    } else {
      axios.post('/signup', {
        firstName,
        lastName,
        email,
        password,
      })
        .then((response) => {
          console.log("response: " + response);
          this.setState({
            messageFromServer: response.data.message,
            showError: false,
            registerError: false,
            errorMsg: []
          });
        })
        .catch((error) => {
          console.log(JSON.stringify(error.response.data.errors));
          var msgList = [];
          error.response.data.errors.forEach(element => {
            msgList.push(element.msg);
          });
          this.setState({
            showError: true,
            registerError: false,
            errorMsg: msgList
          })
          // if (error.response.data === 'email already taken') {
          //   this.setState({
          //     showError: true,
          //     registerError: false,
          //   });
          // }
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
      errorMsg
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
                name="firstName"
                placeholder="John"
                onChange={this.handleInputChange}
                value={firstName}
              />
            </Form.Field>
            <Form.Field required>
              <label>Last Name</label>
              <input
                name="lastName"
                placeholder="Smith"
                onChange={this.handleInputChange}
                value={lastName}
              />
            </Form.Field>
            <Form.Field required>
              <label>Email</label>
              <input
                name="email"
                placeholder="example@mit.edu"
                onChange={this.handleInputChange}
                value={email}
              />
            </Form.Field>
            <Form.Field required>
              <label>Password</label>
              <input
                name="password"
                placeholder="Password at least 6 characters long"
                onChange={this.handleInputChange}
                value={password}
                autoComplete="off"
                type="password"
              />
            </Form.Field>
            <Button type="submit" onClick={this.handleSubmit}>Register</Button>
          </Form>
          {showError === true && registerError === true && (
            <Message
              error
              header="Action Forbidden"
              content="Please fill in all required fields."
            />
          )}
          {showError === true && errorMsg.length !== 0 && (
            <Message
              error
              header="Please fix the following and try again."
              list={errorMsg}
            >
            </Message>
          )}
        </Container>
      );
    } if (messageFromServer === 'user created') {
      return (
        <div>
          <Header as="h1">
          Successfully registered!
          </Header>
          <Button as={Link} to="/login">Go login!</Button>
        </div>
      );
    }
  }
}

export default SignUp;
