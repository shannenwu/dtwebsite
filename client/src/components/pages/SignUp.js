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
      errorMsg: []
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
      firstName,
      lastName,
      email,
      password,
    } = this.state;

    axios.post('/signup', {
      firstName,
      lastName,
      email,
      password,
    })
      .then((response) => {
        this.setState({
          messageFromServer: response.data.message,
          showError: false,
          errorMsg: []
        });
      })
      .catch((error) => {
        var msgList = [];
        error.response.data.errors.forEach(element => {
          msgList.push(element.msg);
        });
        this.setState({
          showError: true,
          errorMsg: msgList
        })
      });
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      messageFromServer,
      showError,
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
                autoComplete="off"
                type="password"
                onChange={this.handleInputChange}
                value={password}
              />
            </Form.Field>
            <Button type="submit" onClick={this.handleSubmit}>Register</Button>
          </Form>
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
