import React from "react";
import { Button, Form } from 'semantic-ui-react';
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

  handleSubmit = (event) => {
    event.preventDefault();
    
    axios.post('/signup', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Field>
            <label>First Name</label>
            <input 
              name='firstName'
              placeholder='First Name' 
              onChange={this.handleInputChange}
              value={this.state.firstName}
              />
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <input 
              name='lastName'
              placeholder='Last Name' 
              onChange={this.handleInputChange}
              value={this.state.lastName}
              />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input 
              name='email'
              placeholder='Email' 
              onChange={this.handleInputChange}
              value={this.state.email}
              />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input 
              name='password'
              placeholder='password' 
              onChange={this.handleInputChange}
              value={this.state.password}
              autoComplete="off"
              />
          </Form.Field>
          <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
        </Form>
      </div>
    )
    ;
  }
}

export default SignUp;
