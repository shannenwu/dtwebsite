import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Message, Form, Button, Dropdown, Dimmer, Loader
} from 'semantic-ui-react';
import axios from 'axios';
import './user.css';

const maxNumberOptions = [
  { key: '1', text: '1', value: 1 },
  { key: '2', text: '2', value: 2 },
  { key: '3', text: '3', value: 3 },
  { key: '4', text: '4', value: 4 }
];

class PrefsheetInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
    prefData: PropTypes.object,
    activeShow: PropTypes.object,
    handleInputChange: PropTypes.func,
    handleListChange: PropTypes.func,
    handleSubmit: PropTypes.func,
    messageFromServer: PropTypes.string,
    errorMsg: PropTypes.array,
    loading: PropTypes.bool
  }

  componentDidMount() {
    const {
      activeShow
    } = this.props;
  }

  render() {
    const {
      prefData,
      activeShow,
      handleInputChange,
      handleListChange,
      handleSubmit,
      handleDismiss,
      messageFromServer,
      errorMsg,
      loading
    } = this.props;

    if (!activeShow.prefsOpen) {
      return (<div>Prefs are not open!</div>)
    } else if (loading) {
      return (
        <Dimmer active inverted>
          <Loader></Loader>
        </Dimmer>
      );
    }
    return (
      <Form as={Grid} stackable>
        <Grid.Row width={13}>
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
            value={prefData.maxDances || ''}
            onChange={handleInputChange}
          />
        </Grid.Row>
        {prefData.rankedDances.map((rankedDance, index) => {
          return (
            <Grid.Row key={index} width={13}>
              <Grid.Column width={3} verticalAlign="middle" textAlign="right">
                <label className="userInfoLabels">{index + 1}:</label>
              </Grid.Column>
              <Dropdown
                as={Grid.Column}
                width={10}
                name={index}
                selection
                search
                upward={false}
                options={prefData.danceOptions}
                value={rankedDance.dance}
                onChange={handleListChange}
              />
            </Grid.Row>
          )
        })}

        <Grid.Row width={13}>
          <Grid.Column width={13} className="userInput">
            <Button floated="right" color="blue" onClick={handleSubmit}>Save</Button>
          </Grid.Column>
        </Grid.Row>

        {errorMsg.length !== 0 && (
          <Grid.Row width={13}>
            <Grid.Column width={13} className="userInput">
              <Message
                negative
                header="Please fix the following and try again."
                list={errorMsg}
              />
            </Grid.Column>
          </Grid.Row>
        )}
        {messageFromServer === 'Preference sheet updated!' ? (
          <Grid.Row width={13}>
            <Grid.Column width={13} className="userInput">
              <Message
                onDismiss={handleDismiss}
                header={messageFromServer}
                positive
              />
            </Grid.Column>
          </Grid.Row>
        ) : (
            <div />
          )
        }
      </Form>
    );
  }
}

export default PrefsheetInfo;
