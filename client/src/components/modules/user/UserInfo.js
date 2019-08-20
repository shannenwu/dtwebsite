import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dropdown, Form, Image, Input, List, Message, TextArea
} from 'semantic-ui-react';
import axios from 'axios';
import ImageModal from './ImageModal';
import { genderOptions, yearOptions, affilOptions } from './UserConfig';
import './user.css';

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

    const imageUrl = userInfo.imageUrl === '/site_images/default-profile.jpeg' ? 
      '' : `/profile_images/${userInfo._id.toString()}.jpeg`;
    
    this.setState({
      gender: userInfo.gender,
      year: userInfo.year,
      affiliation: userInfo.affiliation,
      livingGroup: userInfo.livingGroup,
      experience: userInfo.experience,
      image: imageUrl,
    });
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.messageFromServer !== prevState.messageFromServer
      || this.state.errorMsg !== prevState.errorMsg) {
      this.scrollToBottom();
    }
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
        this.setState({
          messageFromServer: response.data.message,
          errorMsg: [],
        });
      })
      .catch((error) => {
        const msgList = [];
        error.response.data.errors.forEach((element) => {
          msgList.push(element.msg);
        });
        this.setState({
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
      <Form style={{ padding: '1em' }}>
        <Form.Group widths='equal'>
          <Form.Field required>
            <label>Affiliation</label>
            <Dropdown
              fluid
              name='affiliation'
              selection
              search
              options={affilOptions}
              value={affiliation || ''}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field required>
            <label>Graduation Year</label>
            <Dropdown
              fluid
              name='year'
              selection
              scrolling
              search
              options={yearOptions}
              value={year}
              onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Gender</label>
            <Dropdown
              fluid
              name='gender'
              selection
              options={genderOptions}
              value={gender || ''}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Living Group</label>
            <Input
              fluid
              name='livingGroup'
              onChange={this.handleChange}
              value={livingGroup || ''}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label>Experience</label>
          <TextArea
            name='experience'
            onChange={this.handleChange}
            value={experience || ''}
          />
        </Form.Field>
        <Form.Field required>
          <label>Photo</label>
          {image && (
            <Image wrapped size='small' verticalAlign='top' src={image} onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
          )}
          <ImageModal
            handleImageCrop={this.handleImageCrop}
          />
        </Form.Field>
        {errorMsg.length !== 0 && (
          <Message
            className='message-response'
            negative
          >
            <Message.Header
              content='Please fix the following and try again.'
            />
            <List items={errorMsg} />
          </Message>
        )}
        {messageFromServer === 'User information updated!' && (
          <Message
            className='message-response'
            onDismiss={this.handleDismiss}
            header={messageFromServer}
            positive
          />
        )}
        <Button floated='right' color='blue' onClick={this.handleSubmit}>Save</Button>
        <div ref={(el) => { this.el = el; }} />
      </Form>
    );
  }
}

export default UserInfo;
