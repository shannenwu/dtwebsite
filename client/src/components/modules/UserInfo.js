import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Message, Form, Button, Dropdown, Input, Header, Image, Label, Icon
} from 'semantic-ui-react';
import ImageModal from './ImageModal';
import axios from 'axios';
import './modules.css';

const genderOptions = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]

const yearOptions = [];
const begYear = new Date().getFullYear()-2;
for (var i = 0; i < 7; i++) {
  var year = begYear + i;
  yearOptions.push({ key: i.toString(), text: year.toString(), value: year });
}

const affilOptions = [
  { key: 'u', text: 'Undergraduate', value: 'undergraduate' },
  { key: 'g', text: 'Graduate', value: 'graduate' },
  { key: 'o1', text: 'Other', value: 'other' },
]

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
    };
  }

  static propTypes = {
    userInfo: PropTypes.object
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    const{
      userInfo
    } = this.props;
    this.setState({
      gender: userInfo.gender,
      year: userInfo.year,
      affiliation: userInfo.affiliation,
      livingGroup: userInfo.livingGroup,
      experience: userInfo.experience,
      image: '/profile_images/'+userInfo._id.toString()+'.jpeg'
    });
}

  handleSubmit = async (event) => {
    const {
      gender,
      year,
      affiliation,
      livingGroup,
      experience,
      image
    } = this.state;
    event.preventDefault();

    axios.post('/api/profile/info', {
      gender,
      year,
      affiliation,
      livingGroup,
      experience,
      image
    })
      .then((response) => {
        this.setState({
          messageFromServer: response.data.message,
          showError: false,
          errorMsg: []
        });
      })
      .catch((error) => {
        var msgList = [];
        error.response.data.errors.forEach(element => {
          msgList.push(element.msg);
        });
        this.setState({
          showError: true,
          errorMsg: msgList
        })
      });
  };

  handleInputChange = (event) => {
    const { target } = event;
    const { value } = target;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  handleSelectChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    });
  }

  handleImageCrop = (img) => {
    this.setState({
      image: img
    });
}

  render() {
    const {
      gender,
      year,
      affiliation,
      livingGroup,
      experience,
      image
    } = this.state;

    return (
          <Form as={Grid} padded stackable>
            <Grid.Row width={13}>
              <Grid.Column width={3} verticalAlign="middle">
              <label className="userInfoLabels">Gender</label>
              </Grid.Column>
              <Dropdown
                as={Grid.Column}
                width={10}
                name='gender'
                selection
                options={genderOptions}
                value={gender || ''}
                onChange={this.handleSelectChange}
              />
            </Grid.Row>
            <Grid.Row width={13}>
              <Grid.Column width={3} verticalAlign="middle">
              <label className="userInfoLabels">Graduation Year</label>
              </Grid.Column>
              <Dropdown
                as={Grid.Column}
                width={10}
                name='year'
                selection
                scrolling
                search
                upward={false}
                options={yearOptions}
                value={year}
                onChange={this.handleSelectChange}
              />
            </Grid.Row>
            <Grid.Row width={13}>
              <Grid.Column width={3} verticalAlign="middle">
              <label className="userInfoLabels">Affiliation</label>
              </Grid.Column>
              <Dropdown
                as={Grid.Column}
                width={10}
                name='affiliation'
                selection
                search
                upward={false}
                options={affilOptions}
                value={affiliation || ''}
                onChange={this.handleSelectChange}
              />
            </Grid.Row>
            <Grid.Row width={13}>
              <Grid.Column width={3} verticalAlign="middle">
              <label className="userInfoLabels">Living Group</label>
              </Grid.Column>
              <Input
                as={Grid.Column}
                width={10}
                name="livingGroup"
                onChange={this.handleInputChange}
                value={livingGroup || ''}
                className="userInput"
              />
            </Grid.Row>
            <Grid.Row width={13}>
              <Grid.Column width={3} verticalAlign="middle">
              <label className="userInfoLabels">Experience</label>
              </Grid.Column>
              <Input
                as={Grid.Column}
                width={10}
                name="experience"
                onChange={this.handleInputChange}
                value={experience || ''}
                className="userInput"
              />
            </Grid.Row>
            <Grid.Row width={13}>
              <Grid.Column width={3} verticalAlign="middle">
              <label className="userInfoLabels">Photo</label>
              </Grid.Column>
              <Grid.Column width={10} textAlign="left" className="userInput">
                {image ? (
                <Grid.Row>
                  <Image wrapped size='small' src={image} />
                </Grid.Row>)
                : (
                  <div></div>
                )}
                <Grid.Row>
                  <ImageModal 
                    handleImageCrop={this.handleImageCrop}
                  />
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row width={13}>
              <Grid.Column width={3} verticalAlign="middle">
              </Grid.Column>
              <Grid.Column width={10} textAlign="right" className="userInput">
                <Button color='blue' onClick={this.handleSubmit}>Save</Button>
              </Grid.Column>
            </Grid.Row>
          </Form>
    );
  }
}

export default UserInfo;
