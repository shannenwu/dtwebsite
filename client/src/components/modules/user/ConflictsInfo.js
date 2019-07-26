import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Message, Form, Button, Input, List
} from 'semantic-ui-react';
import axios from 'axios';
import './user.css';


class ConflictsInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageFromServer: '',
      showError: false,
      errorMsg: [],
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    const {
      userInfo,
    } = this.props;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const {
      errorMsg,
      messageFromServer,
    } = this.state;

    return (
      <div>
        Conflicts!
        <div ref={el => { this.el = el; }} />
      </div>
    );
  }
}

export default ConflictsInfo;