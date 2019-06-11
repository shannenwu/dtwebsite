import React from 'react';
import {
  Grid, Header, Form, Button, Modal, Icon, Dropdown, Input
} from 'semantic-ui-react';
import ShowModal from './ShowModal';
import axios from 'axios';

class ShowList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shows: [],
      modalOpen: false
    };
  }

  componentDidMount() {
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    });
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.setState({ 
      modalOpen: false
    })
  }

  render() {
    const {
      dances,
      modalOpen
    } = this.state;

    return (
      <div>
        <Header as="h3">
          Shows
        </Header>
        <div onClick={this.handleOpen}><Icon link name='add' /></div>
        <ShowModal open={modalOpen} handleClose={this.handleClose} />
      </div>
    );
  }
}

export default ShowList;
