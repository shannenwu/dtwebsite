import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
} from 'semantic-ui-react';
import io from 'socket.io-client';
import DanceModal from './DanceModal';
import './dance.css';

class DanceCardItem extends React.Component {
  constructor(props) {
    super(props);

    this.socket = io(`//${window.location.hostname}:${window.location.port}`, { secure: __SECURE__ });

    this.state = {
      modalOpen: false,
    };
  }

  componentDidMount() {
  }

  static propTypes = {
    danceObj: PropTypes.object,
    userOptions: PropTypes.array,
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    const {
      modalOpen,
    } = this.state;
    const {
      danceObj,
      userOptions,
    } = this.props;

    return (
      <>
        <DanceModal isNew={false} userOptions={userOptions} open={modalOpen} handleClose={this.handleClose} danceObj={danceObj} />
        <Card
          onClick={this.handleOpen}
          key={danceObj._id}
          fluid
        >
          <Card.Content>
            {danceObj.name}
            <Card.Meta>
              {danceObj.level + ' ' + danceObj.style}
            </Card.Meta>
          </Card.Content>
        </Card>
      </>
    );
  }
}

export default DanceCardItem;
