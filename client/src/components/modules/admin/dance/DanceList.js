import React from 'react';
import PropTypes from 'prop-types';
import {
  Header, Icon, Card,
} from 'semantic-ui-react';
import io from 'socket.io-client';
import DanceModal from './DanceModal';
import './dance.css';

class DanceList extends React.Component {
  constructor(props) {
    super(props);

    this.socket = io(`//${window.location.hostname}:${window.location.port}`, {secure: __SECURE__});

    this.state = {
      modalOpen: false,
    };
  }

  componentDidMount() {
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
      userOptions,
    } = this.props;

    return (
      <div id='admin-dance-list'>
        <Header as='h3'>
          Dances
          <Icon onClick={this.handleOpen} link name='plus' style={{ float: 'right', fontSize: '1em' }} />
        </Header>
        <DanceModal userOptions={userOptions} open={modalOpen} handleClose={this.handleClose} show={selectedShow} />
        {dances.map(danceObj => (
          <Card
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
        ))
        }
      </div>
    );
  }
}

export default DanceList;
