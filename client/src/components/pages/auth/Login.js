import React from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import {
  Button,
  Dimmer,
  Form,
  Header,
  Input,
  Loader,
  Message,
} from "semantic-ui-react";
import axios from "axios";
import "./auth.css";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorMsg: [],
      redirect: false,
      loading: false,
    };
  }

  static propTypes = {
    loginUser: PropTypes.func.isRequired,
  };

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const { loginUser } = this.props;

    this.setState({
      loading: true,
    });

    axios
      .post("/login", {
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
    const { email, password, errorMsg, redirect, loading } = this.state;
    if (redirect) {
      return <Redirect to="/profile" />;
    }
    return (
      <div className="login-wrapper">
        <Dimmer active={loading} inverted>
          <Loader content="Logging you in..." />
        </Dimmer>
        <Header
          as="h1"
          content="Welcome Back!"
          style={{ textAlign: "center" }}
        />
        <Form>
          <Form.Field>
            <Input
              name="email"
              placeholder="Email Address"
              onChange={this.handleChange}
              value={email}
            />
          </Form.Field>
          <Form.Field>
            <Input
              name="password"
              placeholder="Password"
              autoComplete="off"
              type="password"
              onChange={this.handleChange}
              value={password}
            />
          </Form.Field>
          <Button type="submit" onClick={this.handleSubmit} fluid>
            Login
          </Button>
        </Form>
        {errorMsg.length !== 0 && (
          <Message error className="login-error-msg">
            <Message.Header content="Error" />
            {errorMsg.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </Message>
        )}
        <div className="login-links">
          <Link to="/signup">Register</Link>
          <Link to="/forgot">Forgot password?</Link>
        </div>
      </div>
    );
  }
}

export default Login;
