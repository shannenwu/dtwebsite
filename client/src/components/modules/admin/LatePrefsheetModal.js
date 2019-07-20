import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Form, Button, Modal, Icon, Dropdown, Input,
} from 'semantic-ui-react';
import PrefsheetInfo from '../user/PrefsheetInfo';
import axios from 'axios';

class LatePrefsheetModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      maxDances: -1,
      rankedDances: []
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    activeShow: PropTypes.object
  }

  componentDidMount() {
  }

  handleLateChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  handleListChange = (e, { name, value }) => {
    const { rankedDances } = this.state;
    const copy = [...rankedDances];
    copy[name] = { dance: value }
    this.setState({
      rankedDances: copy
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      userId,
      maxDances,
      rankedDances
    } = this.state;

    const {
      handleClose,
      activeShow,
    } = this.props;

    axios.post(`/api/prefsheets/user/${userId}`, {
      show: activeShow,
      maxDances: maxDances,
      rankedDances: rankedDances
    })
      .then((response) => {
        this.setState({
          userId: '',
          maxDances: -1,
          rankedDances: []
        });
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const {
      userId,
      maxDances,
      rankedDances
    } = this.state;

    const {
      open,
      handleClose,
      activeShow,
      userOptions
    } = this.props;

    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Modal.Header>Create Late Prefsheet</Modal.Header>
          <Modal.Content scrolling>
            <PrefsheetInfo
              prefData={{userId, maxDances, rankedDances}}
              activeShow={activeShow}
              handleInputChange={this.handleLateChange}
              handleListChange={this.handleListChange}
              handleSubmit={this.handleSubmit}
              userOptions={userOptions}
              isLate={true}
            >
            </PrefsheetInfo>
            <Form>
              <Form.Field>
                <label>Dancer</label>
                <Dropdown
                  name="userId"
                  selection
                  search
                  scrolling
                  upward={false}
                  options={userOptions}
                  value={userId || ''}
                  onChange={this.handleChange}
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

export default LatePrefsheetModal;
