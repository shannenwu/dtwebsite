import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Form, Button, Icon, Card, Loader,
} from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';
import DanceModal from './DanceModal';

class DanceList extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.socket = io(`http://${window.location.hostname}:3000`);

    this.state = {
      modalOpen: false,
    };
  }

  componentDidMount() {
    // socket for adding dance is in admin page.
    this._isMounted = true;
  }

  static propTypes = {
    selectedShow: PropTypes.object,
    handleDeleteDance: PropTypes.func,
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
      dances,
      selectedShow,
      handleDeleteDance,
      userOptions,
    } = this.props;

    return (
      <div>
        <Header as="h3">
          Dances
          <Icon onClick={this.handleOpen} link name="plus" style={{float: 'right', fontSize: '1em'}}/>
        </Header>
        <DanceModal userOptions={userOptions} open={modalOpen} handleClose={this.handleClose} show={selectedShow} />
        {dances.map(danceObj => (
          <Card
            key={danceObj._id}
          >
            <Card.Content>
              {danceObj.name}
            </Card.Content>
          </Card>
        ))
        }
      </div>
    );
  }
}

export default DanceList;
