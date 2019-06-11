import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Form, Button, Modal, Icon, Dropdown, Input
} from 'semantic-ui-react';
import axios from 'axios';

const begYear = new Date().getFullYear();
const yearOptions = [
  { key: '0', text: begYear.toString(), value: begYear },
  { key: '1', text: (begYear+1).toString(), value: begYear+1 },
]

class ShowModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      year: -1,
      semester: '',
      prefsOpen: false
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
  }

  componentDidMount() {
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      name,
      description, 
      year,
      semester,
      prefsOpen
    } = this.state;

    const {
      handleClose,
    } = this.props;

    axios.post('/api/shows', {
      name,
      description, 
      year,
      semester,
      prefsOpen
    })
      .then((response) => {
        this.setState({
          messageFromServer: response.data.message,
          showError: false,
          errorMsg: []
        });
        handleClose();
      })
      .catch((error) => {
        console.log(error);
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

  render() {
    const {
      name,
      description, 
      year,
      semester
    } = this.state;

    const {
        open,
        handleClose,
      } = this.props;

    return (
      <div>
        <Modal 
          open={open} 
          onClose={handleClose}>
          <Modal.Header>Add a Show</Modal.Header>
          <Modal.Content scrolling>
              <Form>
                <Form.Group inline>
                  <label>Semester</label>
                  <Form.Radio
                    name='semester'
                    label='Fall'
                    value='fall'
                    checked={semester === 'fall'}
                    onChange={this.handleChange}
                  />
                  <Form.Radio
                    name='semester'
                    label='Spring'
                    value='spring'
                    checked={semester === 'spring'}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Field required>
                  <label>Year</label>
                  <Dropdown
                    name='year'
                    selection
                    search
                    upward={false}
                    options={yearOptions}
                    value={year}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Name</label>
                  <Input
                    name="name"
                    onChange={this.handleChange}
                    value={name}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Description</label>
                  <Input
                    name="description"
                    onChange={this.handleChange}
                    value={description}
                  />
                </Form.Field>
                <Modal.Actions>
                  <Button color='green' floated='right' onClick={this.handleSubmit}>Save</Button>
                  <Button floated='right' onClick={handleClose}>Cancel</Button>
                </Modal.Actions>
              </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ShowModal;
