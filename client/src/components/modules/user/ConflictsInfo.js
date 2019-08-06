import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Message, Form, Button, Input, List,
} from 'semantic-ui-react';
import ScheduleSelector from 'react-schedule-selector';
import axios from 'axios';
import './user.css';


class ConflictsInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schedule: [],
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

  handleChange = (newSchedule) => {
    this.setState({
      schedule: newSchedule
    });
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const {
      errorMsg,
      messageFromServer,
    } = this.state;
    const dummyDate = new Date(2019, 8, 1);

    return (
      <div>
        <Message info>
          Please select all the times you are NOT available on a weekly basis.
          For times you are not available, please describe your conflict in the following format:
          TODO LATER
        </Message>
        <ScheduleSelector
          selection={this.state.schedule}
          startDate={dummyDate}
          minTime={13}
          maxTime={23}
          dateFormat={'ddd'}
          hoveredColor={'#f9c8c8'}
          selectedColor={'#ff7f7f'}
          onChange={this.handleChange}
        />
        <div ref={(el) => { this.el = el; }} />
      </div>
    );
  }
}

export default ConflictsInfo;
