import React from 'react';
import {
  Grid, Message, Header, Form, Button,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirmPassword: '',
      messageFromServer: '',
      errorMsg: [],
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
      password,
      confirmPassword,
    } = this.state;

    const resetLink = `/reset/${this.props.match.params.resetPasswordToken}`;

    axios.post(resetLink, {
      password,
      confirmPassword,
      resetPasswordToken: this.props.match.params.resetPasswordToken,
    })
      .then((response) => {
        this.setState({
          messageFromServer: response.data.message,
          errorMsg: [],
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
          });
        } else {
          // unregistered email
          this.setState({
            errorMsg: [error.response.data],
          });
        }
      });
  };

  render() {
    const {
      password,
      confirmPassword,
      errorMsg,
      messageFromServer,
    } = this.state;
    if (messageFromServer === '') {
      return (
        <Grid padded columns={1}>
          <Grid.Column>
            <Header as="h1">
              Reset Your Password
            </Header>
            <Form>
              <Form.Field>
                <label>New Password</label>
                <input
                  name="password"
                  onChange={this.handleInputChange}
                  value={password}
                  autoComplete="off"
                  type="password"
                />
              </Form.Field>
              <Form.Field>
                <label>Confirm New Password</label>
                <input
                  name="confirmPassword"
                  onChange={this.handleInputChange}
                  value={confirmPassword}
                  autoComplete="off"
                  type="password"
                />
              </Form.Field>
              <Button type="submit" onClick={this.handleSubmit} color="blue">
                Reset Password
              </Button>
            </Form>
            {errorMsg.length !== 0 && (
              <Message
                error
                header="Please fix the following and try again."
                list={errorMsg}
              />
            )}
          </Grid.Column>
        </Grid>
      );
    } if (messageFromServer === 'Password changed successfully.') {
      return (
        <div>
          <Header as="h1">
            Password changed!
          </Header>
          <Button as={Link} to="/login">Go login!</Button>
        </div>
      );
    }
  }
}

export default ResetPassword;
