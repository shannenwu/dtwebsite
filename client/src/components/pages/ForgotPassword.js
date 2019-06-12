import React from 'react';
import {
  Grid, Message, Header, Form, Button,
} from 'semantic-ui-react';
import axios from 'axios';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      errorMsg: [],
      loading: false,
    };
  }

  componentDidMount() {
    document.title = 'Forgot Password';
  }

    triggerLoading = () => {
      this.setState({
        loading: true,
      });
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
      this.triggerLoading();
      const {
        email,
      } = this.state;

      axios.post('/forgot', {
        email,
      })
        .then((response) => {
          this.setState({
            messageFromServer: response.data.message,
            showError: false,
            errorMsg: [],
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
              showError: true,
              errorMsg: msgList,
              loading: false,
            });
          } else {
            // unregistered email
            this.setState({
              showError: true,
              errorMsg: [error.response.data],
              loading: false,
            });
          }
        });
    };

    render() {
      const {
        email,
        showError,
        errorMsg,
        messageFromServer,
        loading,
      } = this.state;

      let infoMessage;
      if (loading) {
        infoMessage = <Message header="Sending..." />;
      } else if (showError) {
        infoMessage = <Message error header="Please fix the following and try again." list={errorMsg} />;
      } else if (messageFromServer === 'Recovery email sent!') {
        infoMessage = <Message success header="Recovery email sent!" />;
      } else {
        infoMessage = null;
      }
      return (
        <Grid padded columns={1}>
          <Grid.Column>
            <Header as="h1">
                        Forgot Your Password?
            </Header>
            <Form>
              <Form.Field>
                <label>Email</label>
                <input
                  name="email"
                  onChange={this.handleInputChange}
                  value={email}
                />
              </Form.Field>
              <Button type="submit" onClick={this.handleSubmit} color="blue">
                            Send Password Reset Email
              </Button>
            </Form>
            {infoMessage !== null && infoMessage}
          </Grid.Column>
        </Grid>
      );
    }
}

export default ForgotPassword;
