import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Form, Button, Icon, Card, Loader
} from 'semantic-ui-react';
import DanceModal from './DanceModal';
import axios from 'axios';
import io from 'socket.io-client';
import './admin.css';

class DanceList extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.socket = io('http://localhost:3000');

    this.state = {
      modalOpen: false,
      loading: false, // change later
      userOptions: [],
      endpoint: 'http://localhost:3000',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUserOptions();
  }

  static propTypes = {
    selectedShow: PropTypes.object,
    loading: PropTypes.bool,
    handleDeleteDance: PropTypes.func
  }

  getUserOptions = () => {
    axios.get('/api/users')
      .then(
        (response) => {
          const users = response.data;
          var userOptions = users.map(user => {
            return {
              key: user.firstName + ' ' + user.lastName,
              text: user.firstName + ' ' + user.lastName,
              value: user._id
            };
          })
          this.setState({
            userOptions: userOptions
          })
        },
      );
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.setState({
      modalOpen: false,
    });
  }

  render() {
    const {
      modalOpen,
      loading,
      userOptions
    } = this.state;
    const {
      dances,
      selectedShow,
      handleDeleteDance
    } = this.props;

    return (
      <div>
        <Header as="h3">
          Dances
          </Header>
        <div onClick={this.handleOpen}><Icon link name="add" /></div>
        <DanceModal userOptions={userOptions} open={modalOpen} handleClose={this.handleClose} show={selectedShow}/>
        {loading ? <Loader></Loader> : (
          dances.map(danceObj => {
            //   var pre = showObj.semester === 'fall' ? 'F' : 'S';
            //   var yr = showObj.year.toString().substring(2);
            //   var className = showObj._id === selectedShow ? 'selected' : '';
            return <Card
              key={danceObj._id}
              // className={className}
            // onClick={() => selectShow(showObj._id)}
            >
              <Card.Content>
                {danceObj.name}
                <Icon name='cancel' link onClick={() => handleDeleteDance(danceObj._id)} />
              </Card.Content>
            </Card>
          })
        )}
      </div>
    );

  }
}

export default DanceList;
