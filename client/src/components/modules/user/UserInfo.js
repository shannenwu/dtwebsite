import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Message, Form, Button, Dropdown, Input, Image, List
} from 'semantic-ui-react';
import axios from 'axios';
import ImageModal from './ImageModal';
import './user.css';

// TODO move out options to config file and error handling

const genderOptions = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
];

const yearOptions = [];
const begYear = new Date().getFullYear() - 2;
for (let i = 0; i < 7; i++) {
  const year = begYear + i;
  yearOptions.push({ key: i.toString(), text: year.toString(), value: year });
}

const affilOptions = [
  { key: 'u', text: 'Undergraduate', value: 'undergraduate' },
  { key: 'g', text: 'Graduate', value: 'graduate' },
  { key: 'o1', text: 'Other', value: 'other' },
];

class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gender: '',
      year: -1,
      affiliation: '',
      livingGroup: '',
      experience: '',
      image: '',
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
    this.setState({
      gender: userInfo.gender,
      year: userInfo.year,
      affiliation: userInfo.affiliation,
      livingGroup: userInfo.livingGroup,
      experience: userInfo.experience,
      image: `/profile_images/${userInfo._id.toString()}.jpeg`,
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  handleSubmit = (event) => {
    const {
      gender,
      year,
      affiliation,
      livingGroup,
      experience,
      image,
    } = this.state;
    const {
      userInfo,
    } = this.props;
    event.preventDefault();

    axios.post(`/api/users/${userInfo._id}`, {
      gender,
      year,
      affiliation,
      livingGroup,
      experience,
      image,
    })
      .then((response) => {
        console.log(response.data.message);
        this.setState({
          messageFromServer: response.data.message,
          showError: false,
          errorMsg: [],
        });
      })
      .catch((error) => {
        const msgList = []; 
        error.response.data.errors.forEach((element) => {
          msgList.push(element.msg);
        });
        this.setState({
          showError: true,
          errorMsg: msgList,
        });
      });
  };

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  handleImageCrop = (img) => {
    this.setState({
      image: img,
    });
  }

  handleDismiss = () => {
    this.setState({
      messageFromServer: '',
    });
  }

  render() {
    const {
      gender,
      year,
      affiliation,
      livingGroup,
      experience,
      image,
      errorMsg,
      messageFromServer,
    } = this.state;

    return (
      <Form as={Grid} padded stackable>
        <Grid.Row>
          <Grid.Column width={3} verticalAlign="middle">
            <label className="userInfoLabels">Gender</label>
          </Grid.Column>
          <Dropdown
            as={Grid.Column}
            width={13}
            name="gender"
            selection
            options={genderOptions}
            value={gender || ''}
            onChange={this.handleChange}
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3} verticalAlign="middle">
            <label className="userInfoLabels">Graduation Year</label>
          </Grid.Column>
          <Dropdown
            as={Grid.Column}
            width={13}
            name="year"
            selection
            scrolling
            search
            options={yearOptions}
            value={year}
            onChange={this.handleChange}
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3} verticalAlign="middle">
            <label className="userInfoLabels">Affiliation</label>
          </Grid.Column>
          <Dropdown
            as={Grid.Column}
            width={13}
            name="affiliation"
            selection
            search
            options={affilOptions}
            value={affiliation || ''}
            onChange={this.handleChange}
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3} verticalAlign="middle">
            <label className="userInfoLabels">Living Group</label>
          </Grid.Column>
          <Input
            as={Grid.Column}
            width={13}
            name="livingGroup"
            onChange={this.handleChange}
            value={livingGroup || ''}
            className="userInput"
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3} verticalAlign="middle">
            <label className="userInfoLabels">Experience</label>
          </Grid.Column>
          <Input
            as={Grid.Column}
            width={13}
            name="experience"
            onChange={this.handleChange}
            value={experience || ''}
            className="userInput"
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3} verticalAlign="middle">
            <label className="userInfoLabels">Photo</label>
          </Grid.Column>
          <Grid.Column width={13} textAlign="left" className="userInput">
            {image && (
              <Grid.Row>
                <Image wrapped size="small" src={image} onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
              </Grid.Row>
            )}
            <Grid.Row>
              <ImageModal
                handleImageCrop={this.handleImageCrop}
              />
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} className="userInput">
            <Button floated="right" color="blue" onClick={this.handleSubmit}>Save</Button>
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
        {messageFromServer === 'User information updated!' && (
          <Grid.Row>
            <Grid.Column width={16} className="userInput">
              <Message
                className="response"
                onDismiss={this.handleDismiss}
                header={messageFromServer}
                positive
              />
            </Grid.Column>
          </Grid.Row>
        )}
        <div ref={el => { this.el = el; }} />
      </Form>
    );
  }
}

export default UserInfo;
