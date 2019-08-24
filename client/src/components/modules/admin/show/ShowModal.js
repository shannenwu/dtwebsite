import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Modal, Input, Message, List
} from 'semantic-ui-react';
import axios from 'axios';

class ShowModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      year: '',
      semester: '',
      prefsOpen: false,
      errorMsg: []
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
  }

  componentDidMount() {
  }

  handleShowModalClose = () => {
    const { handleClose } = this.props;
    this.setState({
      name: '',
      year: '',
      semester: '',
      errorMsg: [],
    });
    handleClose();
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
      year,
      semester,
      prefsOpen,
    } = this.state;

    axios.post('/api/shows', {
      name,
      year,
      semester,
      prefsOpen,
    })
      .then((response) => {
        this.handleShowModalClose();
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

  render() {
    const {
      name,
      year,
      semester,
      errorMsg
    } = this.state;

    const {
      open,
    } = this.props;

    return (
      <div>
        <Modal
          open={open}
          onClose={this.handleShowModalClose}
        >
          <Modal.Header>Add a Show</Modal.Header>
          <Modal.Content scrolling>
            <Form>
              <Form.Group inline>
                <label>Semester</label>
                <Form.Radio
                  name='semester'
                  label='Fall'
                  value='F'
                  checked={semester === 'F'}
                  onChange={this.handleChange}
                />
                <Form.Radio
                  name='semester'
                  label='Spring'
                  value='S'
                  checked={semester === 'S'}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Field>
                <label>Year</label>
                <Input
                  name='year'
                  placeholder='YYYY'
                  onChange={this.handleChange}
                  value={year}
                />
              </Form.Field>
              <Form.Field>
                <label>Name</label>
                <Input
                  name='name'
                  onChange={this.handleChange}
                  value={name}
                />
              </Form.Field>
              {errorMsg.length !== 0 && (
                <Message
                  className='response'
                  negative
                  style={{ textAlign: 'center' }}
                >
                  <Message.Header content='Please fix the following and try again.' />
                  <List items={errorMsg} />
                </Message>
              )}
              <Modal.Actions>
                <Button color='green' floated='right' onClick={this.handleSubmit}>Save</Button>
                <Button floated='right' onClick={this.handleShowModalClose}>Cancel</Button>
              </Modal.Actions>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ShowModal;
