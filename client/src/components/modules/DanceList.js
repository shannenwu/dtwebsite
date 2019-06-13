import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Form, Button, Icon, Card, Loader
} from 'semantic-ui-react';
import DanceModal from './DanceModal';
import axios from 'axios';
import io from 'socket.io-client';
import '../../css/app.css';

class DanceList extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      loading: false, // change later
      dances: [],
      userOptions: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUserOptions();

    const socket = io(endpoint);
    socket.on('dance', (danceObj) => {
      const newDances = [danceObj].concat(this.state.dances);
      if (this._isMounted) {
        this.setState({
          dances: newDances
        });
      }
    });
  }

  static propTypes = {
    selectedShow: PropTypes.string
  }

  // getDances = () => {
  //   axios.get('/api/shows')
  //     .then(
  //       (response) => {
  //         const shows = response.data;
  //         this.setState({
  //           shows,
  //           selectedShow: shows[0]._id,
  //           loading: false,
  //         });
  //       },
  //     );
  // }

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
      dances,
      userOptions
    } = this.state;
    const {
      selectedShow
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
              className={className}
            // onClick={() => selectShow(showObj._id)}
            >
              <Card.Content>
                {/* {pre+yr+' | '+showObj.name} */}
              </Card.Content>
            </Card>
          })
        )}
      </div>
    );

  }
}

export default DanceList;
