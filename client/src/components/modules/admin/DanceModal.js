import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Form, Button, Modal, Icon, Dropdown, Input,
} from 'semantic-ui-react';
import axios from 'axios';

// TODO move options to separate config file

const styleOptions = [
  { key: 'h', text: 'Hip Hop', value: 'hip hop' },
  { key: 'g', text: 'Contemporary', value: 'contemp' },
  { key: 'f', text: 'Fusion', value: 'fusion' },
  { key: 'b', text: 'Ballet', value: 'ballet' },
  { key: 't', text: 'Tap', value: 'tap' },
  { key: 'o', text: 'Other', value: 'other' },
];

const levelOptions = [
  { key: 'al', text: 'All Levels', value: 'all levels' },
  { key: 'b', text: 'Beginner', value: 'beginner' },
  { key: 'bi', text: 'Beg/Int', value: 'beg/int' },
  { key: 'i', text: 'Int', value: 'int' },
  { key: 'ia', text: 'Int/Adv', value: 'int/adv' },
  { key: 'a', text: 'Advanced', value: 'advanced' },
  { key: 'o', text: 'Other', value: 'other' },
];

class DanceModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      choreographers: [],
      style: '',
      level: '',
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    show: PropTypes.object
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
      choreographers,
      style,
      level
    } = this.state;

    const {
      handleClose,
      show,
    } = this.props;

    axios.post('/api/dances', {
      name,
      description,
      choreographers,
      style,
      level,
      show
    })
      .then((response) => {
        // this.setState({
        //   messageFromServer: response.data.message,
        //   showError: false,
        //   errorMsg: [],
        // });
          this.setState({
            name: '',
            description: '',
            choreographers: [],
            style: '',
            level: '',
        });
        handleClose();
      })
      .catch((error) => {
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
      choreographers,
      style,
      level
    } = this.state;

    const {
      open,
      handleClose,
      userOptions
    } = this.props;

    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Modal.Header>Add a Dance</Modal.Header>
          <Modal.Content scrolling>
            <Form>
              <Form.Field>
                <label>Choreographers</label>
                <Dropdown
                  name="choreographers"
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
                  name="name"
                  onChange={this.handleChange}
                  value={name}
                />
              </Form.Field>
              <Form.Field>
                <label>Style</label>
                <Dropdown
                  name="style"
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
                  name="level"
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

export default DanceModal;
