import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Message, Form, Button, Dropdown, List,
} from 'semantic-ui-react';
import './user.css';

const maxNumberOptions = [
  { key: '1', text: '1', value: 1 },
  { key: '2', text: '2', value: 2 },
  { key: '3', text: '3', value: 3 },
  { key: '4', text: '4', value: 4 },
];

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
        <Message info>
          View detailed dance descriptions HERE.
          Please only pref the dances you want to be in.
          Make sure you have also uploaded a profile photo—
          choreographers can't accept you into their dance if they don't know who you are!
          Prefsheets can be re-submitted until they close at 2AM DATE HERE.
        </Message>
        <Form as={Grid} padded stackable>
          {isLate
            && (
              <Grid.Row>
                <Grid.Column width={3} verticalAlign="middle">
                  <label className="userInfoLabels">Dancer</label>
                </Grid.Column>
                <Dropdown
                  name="userId"
                  width={13}
                  selection
                  search
                  scrolling
                  upward={false}
                  options={userOptions}
                  value={prefData.userId || ''}
                  onChange={handleInputChange}
                />
              </Grid.Row>
            )
          }
          <Grid.Row>
            <Grid.Column width={3} verticalAlign="middle">
              <label className="userInfoLabels">Max number of dances</label>
            </Grid.Column>
            <Dropdown
              as={Grid.Column}
              name="maxDances"
              selection
              search
              upward={false}
              options={maxNumberOptions}
              value={prefData.maxDances || -1}
              onChange={handleInputChange}
            />
          </Grid.Row>
          {prefData.rankedDances.map((rankedDance, index) => (
            <Grid.Row key={index}>
              <Grid.Column width={3} verticalAlign="middle" textAlign="right">
                <label className="userInfoLabels">
                  {index + 1}
                  .
                </label>
              </Grid.Column>
              <Dropdown
                as={Grid.Column}
                width={13}
                name={index}
                selection
                clearable
                search
                upward={false}
                options={prefData.danceOptions}
                value={rankedDance.dance}
                onChange={handleListChange}
              />
            </Grid.Row>
          ))}

          <Grid.Row>
            <Grid.Column width={16} className="userInput">
              <Button floated="right" color="blue" onClick={handleSubmit}>Submit</Button>
            </Grid.Column>
          </Grid.Row>

          {errorMsg.length !== 0 && (
            <Grid.Row>
              <Grid.Column width={16} className="userInput">
                <Message
                  className="response"
                  negative
                >
                  <Message.Header
                    content="Please fix the following and try again."
                  />
                  <List items={errorMsg} />
                </Message>
              </Grid.Column>
            </Grid.Row>
          )}
          {messageFromServer === 'Preference sheet updated!' && (
            <Grid.Row>
              <Grid.Column width={16} className="userInput">
                <Message
                  className="response"
                  onDismiss={handleDismiss}
                  header={
                  isLate ? (
                    messageFromServer + ' Late audition number: ' + lateAuditionNum
                  ) : messageFromServer
                  }
                  positive
                />
              </Grid.Column>
            </Grid.Row>
          )}
          <div ref={(el) => { this.el = el; }} />
        </Form>
      </div>
    );
  }
}

export default PrefsheetInfo;
