import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dropdown, Form, Input, List, Message, Modal,
} from 'semantic-ui-react';
import axios from 'axios';
import { styleOptions, levelOptions, auditionNoteOptions } from './DanceConfig';

class DanceModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      choreographers: [],
      style: '',
      level: '',
      videoUrl: '',
      auditionNote: '',
      errorMsg: [],
    };
  }

  static propTypes = {
    isNew: PropTypes.bool,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    show: PropTypes.object,
    danceObj: PropTypes.object,
  }

  componentDidMount() {
    const { isNew, danceObj } = this.props;
    // This is an anti-pattern, refactor sometime
    if (!isNew) {
      this.setState({
        name: danceObj.name,
        description: danceObj.description,
        choreographers: danceObj.choreographers.map(obj => obj._id),
        style: danceObj.style,
        level: danceObj.level,
        videoUrl: danceObj.videoUrl,
        auditionNote: danceObj.auditionNote
      });
    }
  }

  handleDanceModalClose = () => {
    const { isNew, handleClose } = this.props;
    if (isNew) {
      this.setState({
        name: '',
        description: '',
        choreographers: [],
        style: '',
        level: '',
        videoUrl: '',
        auditionNote: '',
        errorMsg: [],
      });
    }
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
      videoUrl,
      auditionNote,
    } = this.state;

    const {
      isNew,
      show,
      danceObj
    } = this.props;

    const endpoint = isNew ? '/api/dances' : `/api/dances/update/${danceObj._id}`;

    axios.post(endpoint, {
      name,
      description,
      choreographers,
      style,
      level,
      videoUrl,
      auditionNote,
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
      videoUrl,
      auditionNote,
      errorMsg,
    } = this.state;

    const {
      isNew,
      open,
      userOptions,
    } = this.props;

    return (
      <div>
        <Modal
          open={open}
          onClose={this.handleDanceModalClose}
        >
          <Modal.Header>{isNew ? 'Add Dance' : 'Edit Dance'}</Modal.Header>
          <Modal.Content scrolling>
            <Form onSubmit={this.handleSubmit}>
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
              <Form.Field>
                <label>Audition Note</label>
                <Dropdown
                  name='auditionNote'
                  selection
                  search
                  scrolling
                  upward={false}
                  options={auditionNoteOptions}
                  value={auditionNote || ''}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Video Url</label>
                <Input
                  name='videoUrl'
                  onChange={this.handleChange}
                  value={videoUrl}
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
