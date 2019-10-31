import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Confirm, Dimmer, Header, Icon, Loader, Table } from 'semantic-ui-react';
import AddDancerModal from './AddDancerModal';
import './list.css';

class DancerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      danceObj: null,
      userToRemove: null,
      confirmOpen: false,
      modalOpen: false,
      userOptions: [],
      loading: true
    }
  }

  static propTypes = {
    userInfo: PropTypes.object,
    getUserOptions: PropTypes.func.isRequired,
  }

  static defaultProps = {
    userInfo: null
  }

  async componentDidMount() {
    const { getUserOptions } = this.props;
    document.title = 'Dancer List';
    const danceResponse = await this.getDancePopulated();
    const userOptions = await getUserOptions();

    this.setState({
      danceObj: danceResponse.data,
      userOptions,
      loading: false
    })
  }

  getDancePopulated = async () => {
    try {
      const response = await axios.get(`/api/dances/accepted-dancers/${this.props.match.params.danceId}`);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  showRemoveModal = (user) => {
    this.setState({
      userToRemove: user,
      confirmOpen: true
    });
  }

  handleRemoveCancel = () => {
    this.setState({
      userToRemove: null,
      confirmOpen: false
    })
  }

  handleRemoveConfirm = async () => {
    // Note: There is a possibility this dancer did not have a prefsheet.
    const { danceObj, userToRemove } = this.state;
    const [danceResponse, prefsheetResponse] = await Promise.all([
      await axios.post(`/api/dances/remove-dancer/${danceObj._id}/${userToRemove._id}`),
      await axios.post(`/api/dances/status-update/${danceObj._id}/${userToRemove._id}`, {
        status: 'rejected'
      })
    ]);
    this.setState({
      danceObj: danceResponse.data,
      userToRemove: null,
      confirmOpen: false
    })
  }

  handleAddDancer = async (dancerId) => {
    // Note: There is a possibility this dancer did not have a prefsheet.
    const { danceObj } = this.state;
    const [danceResponse, prefsheetResponse] = await Promise.all([
      await axios.post(`/api/dances/add-dancer/${danceObj._id}/${dancerId}`),
      await axios.post(`/api/dances/status-update/${danceObj._id}/${dancerId}`, {
        status: 'accepted'
      })
    ]);
    this.setState({
      danceObj: danceResponse.data,
    });
  }

  handleOpen = () => {
    this.setState({
      modalOpen: true
    })
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  }

  render() {
    const {
      danceObj,
      userToRemove,
      confirmOpen,
      modalOpen,
      userOptions,
      loading
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted className='dancer-list-loader'>
          <Loader content='Loading dancer list...' />
        </Dimmer>
      );
    }
    return (
      <div id='dancer-list'>
        <AddDancerModal userOptions={userOptions} open={modalOpen} handleClose={this.handleClose} handleAddDancer={this.handleAddDancer} userOptions={userOptions} />
        <Button onClick={() => this.handleOpen()} floated='right' icon labelPosition='left' primary size='small'>
          <Icon name='user' /> Add Dancer
        </Button>
        <Button icon floated='right' size='small' download href={`/reports/dance-final/${danceObj._id}`}>
          <Icon name='download' />
        </Button>
        <Header as='h1' style={{ textTransform: 'capitalize' }}>
          {danceObj.name}
        </Header>
        <Header.Subheader style={{ textTransform: 'capitalize' }}>
          {danceObj.level + ' ' + danceObj.style + ' | ' + danceObj.acceptedDancers.length + ' dancers'}
        </Header.Subheader>
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>First Name</Table.HeaderCell>
              <Table.HeaderCell>Last Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Year</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {danceObj.acceptedDancers.map((user) => {
              return (
                <Table.Row className='remove-row' key={user._id}>
                  <Table.Cell>{user.firstName}</Table.Cell>
                  <Table.Cell>{user.lastName}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.year}</Table.Cell>
                  <Table.Cell>
                    <Icon onClick={() => this.showRemoveModal(user)} className='remove-icon' name='minus circle' color='red' />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Confirm
          className='remove-modal'
          content={userToRemove ? 'This will remove ' + userToRemove.firstName + ' ' + userToRemove.lastName + ' from your dance. Continue?' : ''}
          open={confirmOpen}
          confirmButton='Remove'
          onCancel={this.handleRemoveCancel}
          onConfirm={this.handleRemoveConfirm}
        />
      </div>
    )
  }
}

export default DancerList;
