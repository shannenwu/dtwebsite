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
      rankedDances: new Array(10).fill({dance: ''})
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    activeShow: PropTypes.object,
    userOptions: PropTypes.array, 
    danceOptions: PropTypes.array 
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

    axios.post(`/api/prefsheets/user/${userId}?late=true`, {
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
      userOptions,
      danceOptions
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
              prefData={{userId, maxDances, rankedDances, danceOptions}}
              activeShow={activeShow}
              handleInputChange={this.handleLateChange}
              handleListChange={this.handleListChange}
              handleSubmit={this.handleSubmit}
              userOptions={userOptions}
              isLate={true}
            >
            </PrefsheetInfo>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default LatePrefsheetModal;
