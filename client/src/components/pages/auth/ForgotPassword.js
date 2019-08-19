import React from 'react';
import {
  Button, Form, Grid, Header, Icon, Message
} from 'semantic-ui-react';
import axios from 'axios';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
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
            errorMsg: msgList,
            loading: false,
          });
        } else {
          // error sending mail
          this.setState({
            errorMsg: [error.response.data.message],
            loading: false,
          });
        }
      });
  };

  render() {
    const {
      email,
      errorMsg,
      messageFromServer,
      loading,
    } = this.state;

    let infoMessage;
    if (loading) {
      infoMessage =
        <Message icon>
          <Icon name='circle notched' loading />
          <Message.Header>
            Sending...
          </Message.Header>
        </Message>;
    } else if (errorMsg.length !== 0) {
      infoMessage = <Message error header='There was an error.' list={errorMsg} />;
    } else if (messageFromServer === 'Recovery email sent!') {
      infoMessage = 
      <Message icon success>
        <Icon name='check'/>
        <Message.Header>
          Recovery email sent!
        </Message.Header>
      </Message>;
    } else {
      infoMessage = null;
    }
    return (
      <Grid padded columns={1}>
        <Grid.Column>
          <Header as='h1'>
            Forgot Your Password?
            </Header>
          <Form>
            <Form.Field>
              <label>Email</label>
              <input
                name='email'
                onChange={this.handleInputChange}
                value={email}
              />
            </Form.Field>
            <Button type='submit' onClick={this.handleSubmit} color='blue'>
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
