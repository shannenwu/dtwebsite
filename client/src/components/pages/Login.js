import React from 'react';
import {
  Grid, Message, Header, Segment, Form, Button,
} from 'semantic-ui-react';

class Login extends React.Component {
  render() {
    return (
      <Grid padded centered columns={2}>
        <Grid.Column>
          <Header as="h1">
            Login
          </Header>
          <Segment>
            <Form size="large">
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Email address"
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />
              <Button color="blue" fluid size="large">
              Login
              </Button>
            </Form>
          </Segment>
          <Message>
            Not registered yet?
            {' '}
            <a href="/signup">Sign up!</a>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
