import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
} from 'semantic-ui-react';
import axios from 'axios';
import PrefsheetInfo from '../user/PrefsheetInfo';

class LatePrefsheetModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      maxDances: -1,
      rankedDances: new Array(10).fill({ dance: '' }),
      messageFromServer: '',
      errorMsg: [],
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    activeShow: PropTypes.object.isRequired,
    userOptions: PropTypes.array.isRequired,
    danceOptions: PropTypes.array.isRequired,
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
    copy[name] = { dance: value };
    this.setState({
      rankedDances: copy,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      userId,
      maxDances,
      rankedDances,
    } = this.state;

    const {
      handleClose,
    } = this.props;

    // nothing will happen if the userId is null.
    axios.post(`/api/prefsheets/user/${userId}?late=true`, {
      maxDances,
      rankedDances,
    })
      .then((response) => {
        this.setState({
          userId: '',
          maxDances: -1,
          rankedDances: new Array(10).fill({ dance: '' }),
          messageFromServer: response.data.message,
          errorMsg: [],
        });
        handleClose();
      })
      .catch((error) => {
        if (error.response.data.errors !== undefined) {
          // form validation errors
          const msgList = [];
          error.response.data.errors.forEach((element) => {
            msgList.push(element.msg);
          });
          this.setState({
            errorMsg: msgList,
          });
        } else {
          // other bad errors
          this.setState({
            errorMsg: [error.response.data],
          });
        }
      });
  };

  render() {
    const {
      userId,
      maxDances,
      rankedDances,
      messageFromServer,
      errorMsg,
    } = this.state;

    const {
      open,
      handleClose,
      activeShow,
      userOptions,
      danceOptions,
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
              prefData={{
                userId, maxDances, rankedDances, danceOptions,
              }}
              activeShow={activeShow}
              handleInputChange={this.handleLateChange}
              handleListChange={this.handleListChange}
              handleSubmit={this.handleSubmit}
              messageFromServer={messageFromServer}
              errorMsg={errorMsg}
              userOptions={userOptions}
              isLate
            />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default LatePrefsheetModal;
