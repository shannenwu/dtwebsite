import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Modal, Input,
} from 'semantic-ui-react';
import axios from 'axios';

class ShowModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      year: '',
      semester: '',
      prefsOpen: false,
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
      [name]: value,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      name,
      description,
      year,
      semester,
      prefsOpen,
    } = this.state;

    const {
      handleClose,
    } = this.props;

    axios.post('/api/shows', {
      name,
      description,
      year,
      semester,
      prefsOpen,
    })
      .then((response) => {
        // this.setState({
        //   messageFromServer: response.data.message,
        //   showError: false,
        //   errorMsg: [],
        // });
        handleClose();
      })
      .catch((error) => {
        console.log(error);
        // const msgList = [];
        // error.response.data.errors.forEach((element) => {
        //   msgList.push(element.msg);
        // });
        // this.setState({
        //   showError: true,
        //   errorMsg: msgList,
        // });
      });
  };

  render() {
    const {
      name,
      description,
      year,
      semester,
    } = this.state;

    const {
      open,
      handleClose,
    } = this.props;

    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Modal.Header>Add a Show</Modal.Header>
          <Modal.Content scrolling>
            <Form>
              <Form.Group inline>
                <label>Semester</label>
                <Form.Radio
                  name="semester"
                  label="Fall"
                  value="fall"
                  checked={semester === 'fall'}
                  onChange={this.handleChange}
                />
                <Form.Radio
                  name="semester"
                  label="Spring"
                  value="spring"
                  checked={semester === 'spring'}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Field>
                <label>Year</label>
                <Input
                  name="year"
                  placeholder="YYYY"
                  onChange={this.handleChange}
                  value={year}
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
                <Button color="green" floated="right" onClick={this.handleSubmit}>Save</Button>
                <Button floated="right" onClick={handleClose}>Cancel</Button>
              </Modal.Actions>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ShowModal;
