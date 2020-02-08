import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button, Dropdown, Form, List, Message
} from 'semantic-ui-react';
import './user.css';

const maxNumberOptions = [
  { key: '1', text: '1', value: 1 },
  { key: '2', text: '2', value: 2 },
  { key: '3', text: '3', value: 3 },
  { key: '4', text: '4', value: 4 },
];

const terms = [
  "I am able to perform in all five shows (Thu 5/7 8pm, Fri 5/8 7pm & 10pm, Sat 5/9 1pm & 4pm).",
  "I understand that I must pay dues ($5 if paid on time), as well as a small amount for gifts at the end of the semester.",
  "I understand that the time commitment is 1 hour/week/dance, as well as 2 showings, prod week, and the actual performances."
]

class PrefsheetInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static propTypes = {
    prefData: PropTypes.object,
    handleInputChange: PropTypes.func.isRequired,
    handleListChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleDismiss: PropTypes.func,
    messageFromServer: PropTypes.string,
    errorMsg: PropTypes.array,
    userOptions: PropTypes.array,
    lateAuditionNum: PropTypes.number,
    isLate: PropTypes.bool,
  }

  static defaultProps = {
    prefData: null,
    messageFromServer: '',
    errorMsg: [],
    userOptions: [],
    lateAuditionNum: -1,
    isLate: false,
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.messageFromServer !== prevProps.messageFromServer
      || this.props.errorMsg !== prevProps.errorMsg) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const {
      prefData,
      handleInputChange,
      handleListChange,
      handleSubmit,
      handleDismiss,
      messageFromServer,
      errorMsg,
      userOptions,
      lateAuditionNum,
      isLate,
    } = this.props;

    return (
      <div>
        {!isLate &&
          <Message warning style={{ textAlign: 'center' }}>
            Prefsheets can be re-submitted until Saturday, February 8th at 11:59PM.
            Dance descriptions <Link to='/shows' id='show-link'>here</Link>. Only pref the dances you want to be in!
          </Message>}
        <Form style={{ padding: '1em' }}>
          {isLate
            && (
              <Form.Field>
                <label className='userInfoLabels'>Dancer</label>
                <Dropdown
                  name='userId'
                  selection
                  search
                  scrolling
                  upward={false}
                  options={userOptions}
                  value={prefData.userId || ''}
                  onChange={handleInputChange}
                />
              </Form.Field>
            )
          }
          <Form.Field inline required>
            <label>Max number of dances</label>
            <Dropdown
              name='maxDances'
              selection
              search
              upward={false}
              options={maxNumberOptions}
              value={prefData.maxDances || -1}
              onChange={handleInputChange}
            />
          </Form.Field>
          {prefData.rankedDances.map((rankedDance, index) => (
            <Form.Field className='rank-dance-field' inline key={index}>
              <label className='userInfoLabels'>
                {index + 1}
                .
                </label>
              <Dropdown
                className='rank-dance-dropdown'
                name={index}
                selection
                clearable
                search
                upward={false}
                options={prefData.danceOptions}
                value={rankedDance.dance}
                onChange={handleListChange}
              />
            </Form.Field>
          ))}
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
          {messageFromServer === 'Preference sheet updated!' && (
            <Message
              className='message-response'
              onDismiss={handleDismiss}
              header={
                isLate ? (
                  messageFromServer + ' Late audition number: ' + lateAuditionNum
                ) : messageFromServer
              }
              positive
            />
          )}
          {!isLate &&
            <Message header={'By pressing submit, I agree to the following:'} list={terms} />}
          <Button floated='right' color='blue' onClick={handleSubmit}>Submit</Button>
          <div ref={(el) => { this.el = el; }} />
        </Form>
      </div>
    );
  }
}

export default PrefsheetInfo;