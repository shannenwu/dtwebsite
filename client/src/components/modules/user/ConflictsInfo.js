import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dimmer, Form, List, Loader, Message, TextArea,
} from 'semantic-ui-react';
import axios from 'axios';
import ScheduleSelector from '@shannenwu/react-schedule-selector';

class ConflictsInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: null,
      numDays: null,
      startTime: null,
      endTime: null,
      dateFormat: null,
      loading: true
    };
  }

  static propTypes = {
    isProd: PropTypes.bool,
    conflicts: PropTypes.array.isRequired,
    conflictsDescription: PropTypes.string,
    handleScheduleChange: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleSubmitConflicts: PropTypes.func.isRequired,
    handleDismiss: PropTypes.func.isRequired,
    messageFromServer: PropTypes.string,
    errorMsg: PropTypes.array
  }

  static defaultProps = {
    isProd: false,
    conflictsDescription: '',
    messageFromServer: '',
    errorMsg: []
  }

  componentDidMount() {
    this.getConstants();
  }

  componentDidUpdate(prevProps) {
    if (this.props.messageFromServer !== prevProps.messageFromServer
      || this.props.errorMsg !== prevProps.errorMsg) {
      this.scrollToBottom();
    }
  }

  getConstants = async () => {
    const { isProd } = this.props;
    const response = await axios.get('/api/schedule/constants');
    const constants = response.data;

    var startDate = constants.weekStartDate;
    var numDays = constants.weekDays;
    var startTime = constants.weekStartHour; // 3pm
    var endTime = constants.weekEndHour; // 10:30 pm
    var dateFormat = 'ddd';

    if (isProd) {
      startDate = constants.prodStartDate;
      numDays = constants.prodDays;
      startTime = constants.prodStartHour; // 10am
      endTime = constants.prodEndHour; // 11:30pm
      dateFormat = 'M/D';
    }
    this.setState({
      startDate,
      numDays,
      startTime,
      endTime,
      dateFormat,
      loading: false
    })
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const {
      isProd,
      conflicts,
      conflictsDescription,
      handleScheduleChange,
      handleInputChange,
      handleSubmitConflicts,
      handleDismiss,
      errorMsg,
      messageFromServer
    } = this.props;

    const {
      startDate,
      numDays,
      startTime,
      endTime,
      dateFormat,
      loading
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader content='Loading selection...' />
        </Dimmer>
      );
    }

    return (
      <div>
        {isProd ? (
          <Message info style={{textAlign: 'center'}}>
            Please select all the times you are NOT available for prod week.
            For times you are not available, please describe your conflict below.
          </Message>
        ) : (
            <Message info style={{textAlign: 'center'}}>
              Please select all the times you are NOT available on a weekly basis.
              For times you are not available, please describe your conflict below.
            </Message>
          )}
        <ScheduleSelector
          selection={conflicts}
          startDate={startDate}
          numDays={numDays}
          minTime={startTime}
          maxTime={endTime}
          dateFormat={dateFormat}
          hoveredColor={'#f9c8c8'}
          selectedColor={'#ff7f7f'}
          onChange={handleScheduleChange}
        />
        <Form style={{ paddingTop: '1em' }}>
          <Form.Field>
            <label>Describe your weekly conflicts</label>
            <TextArea
              name='conflictsDescription'
              placeholder='Sundays 6-7: Chapter, Mondays 6-7:30: Volleyball'
              value={conflictsDescription || ''}
              onChange={handleInputChange}
            />
          </Form.Field>
          {errorMsg.length !== 0 && (
            <Message
              className='message-response'
              negative
            >
              <Message.Header
                content='Error'
              />
              <List items={errorMsg} />
            </Message>
          )}
          {messageFromServer === 'Conflicts updated!' && (
            <Message
              className='message-response'
              onDismiss={handleDismiss}
              header={messageFromServer}
              positive
            />
          )}
          <Button floated='right' color='blue' onClick={handleSubmitConflicts} style={{ marginBottom: '1em' }}>Submit</Button>
          <div ref={(el) => { this.el = el; }} />
        </Form>
      </div>
    );
  }
}

export default ConflictsInfo;