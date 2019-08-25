import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dropdown, Form, Modal
} from 'semantic-ui-react';

class AddDancerModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dancerId: '',
      errorMsg: [],
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleAddDancer: PropTypes.func,
    userOptions: PropTypes.array
  }

  componentDidMount() {
  }

  handleAddDancerModalClose = () => {
    const { handleClose } = this.props;
    this.setState({
      dancerId: '',
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
      dancerId
    } = this.state;

    const {
      handleAddDancer,
      handleClose
    } = this.props;

    handleAddDancer(dancerId);
    handleClose();
  };

  render() {
    const {
      errorMsg,
      dancerId
    } = this.state;

    const {
      open,
      userOptions
    } = this.props;

    return (
      <div>
        <Modal
          open={open}
          onClose={this.handleAddDancerModalClose}
        >
          <Modal.Header>Add a Dancer</Modal.Header>
          <Modal.Content scrolling>
            <Form>
              <Form.Field>
                <label>Dancer</label>
                <Dropdown
                  name='dancerId'
                  closeOnChange
                  selection
                  search
                  scrolling
                  minCharacters={2}
                  upward={false}
                  options={userOptions}
                  value={dancerId || ''}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Modal.Actions>
                <Button color='green' floated='right' onClick={this.handleSubmit}>Add</Button>
                <Button floated='right' onClick={this.handleAddDancerModalClose}>Cancel</Button>
              </Modal.Actions>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default AddDancerModal;
