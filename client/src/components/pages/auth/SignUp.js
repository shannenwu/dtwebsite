import React from 'react';
import {
  Button, Container, Form, Header, Input, Message
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
      errorMsg: [],
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
          errorMsg: [],
        });
      })
      .catch((error) => {
        const msgList = [];
        error.response.data.errors.forEach((element) => {
          msgList.push(element.msg);
        });
        this.setState({
          errorMsg: msgList,
        });
      });
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      messageFromServer,
      errorMsg,
    } = this.state;
    if (messageFromServer === '') {
      return (
        <Container>
          <Header as='h1'>
            Create an Account
          </Header>
          <Form>
            <Form.Field required>
              <label>First Name</label>
              <Input
                name='firstName'
                placeholder='John'
                onChange={this.handleChange}
                value={firstName}
              />
            </Form.Field>
            <Form.Field required>
              <label>Last Name</label>
              <Input
                name='lastName'
                placeholder='Smith'
                onChange={this.handleChange}
                value={lastName}
              />
            </Form.Field>
            <Form.Field required>
              <label>Email</label>
              <Input
                name='email'
                placeholder='example@mit.edu'
                onChange={this.handleChange}
                value={email}
              />
            </Form.Field>
            <Form.Field required>
              <label>Password</label>
              <Input
                name='password'
                placeholder='Password at least 6 characters long'
                autoComplete='off'
                type='password'
                onChange={this.handleChange}
                value={password}
              />
            </Form.Field>
            <Button type='submit' onClick={this.handleSubmit}>Register</Button>
          </Form>
          {errorMsg.length !== 0 && (
            <Message
              error
              header='Please fix the following and try again.'
              list={errorMsg}
            />
          )}
        </Container>
      );
    } if (messageFromServer === 'user created') {
      return (
        <div>
          <Header as='h1'>
            Successfully registered!
          </Header>
          <Button as={Link} to='/login'>Go login!</Button>
        </div>
      );
    }
    return <div />;
  }
}

export default SignUp;
