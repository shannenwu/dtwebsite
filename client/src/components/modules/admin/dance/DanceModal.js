import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Button, Modal, Message, List, Dropdown, Input,
} from 'semantic-ui-react';
import axios from 'axios';
import { styleOptions, levelOptions } from './DanceConfig';

class DanceModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      choreographers: [],
      style: '',
      level: '',
      errorMsg: [],
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    show: PropTypes.object,
  }

  componentDidMount() {
  }

  handleDanceModalClose = () => {
    const { handleClose } = this.props;
    this.setState({
      name: '',
      description: '',
      choreographers: [],
      style: '',
      level: '',
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
      description,
      choreographers,
      style,
      level,
    } = this.state;

    const {
      show,
    } = this.props;

    axios.post('/api/dances', {
      name,
      description,
      choreographers,
      style,
      level,
      show,
    })
      .then((response) => {
        this.handleDanceModalClose();
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
      description,
      choreographers,
      style,
      level,
      errorMsg,
    } = this.state;

    const {
      open,
      userOptions,
    } = this.props;

    return (
      <div>
        <Modal
          open={open}
          onClose={this.handleDanceModalClose}
        >
          <Modal.Header>Add a Dance</Modal.Header>
          <Modal.Content scrolling>
            <Form>
              <Form.Field>
                <label>Choreographers</label>
                <Dropdown
                  name='choreographers'
                  closeOnChange
                  selection
                  search
                  multiple
                  scrolling
                  upward={false}
                  options={userOptions}
                  value={choreographers || []}
                  onChange={this.handleChange}
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
              <Form.Field>
                <label>Style</label>
                <Dropdown
                  name='style'
                  selection
                  search
                  scrolling
                  upward={false}
                  options={styleOptions}
                  value={style || ''}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Level</label>
                <Dropdown
                  name='level'
                  selection
                  search
                  scrolling
                  upward={false}
                  options={levelOptions}
                  value={level || ''}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <Input
                  name='description'
                  onChange={this.handleChange}
                  value={description}
                />
              </Form.Field>
              {errorMsg.length !== 0 && (
                <Message
                  className='response'
                  negative
                >
                  <Message.Header content='Please fix the following and try again.' />
                  <List items={errorMsg} />
                </Message>
              )}
              <Modal.Actions>
                <Button color='green' floated='right' onClick={this.handleSubmit}>Save</Button>
                <Button floated='right' onClick={this.handleDanceModalClose}>Cancel</Button>
              </Modal.Actions>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default DanceModal;
