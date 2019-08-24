import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Confirm, Dimmer, Dropdown, Header, Icon, Loader, Table } from 'semantic-ui-react';
import './list.css';

class DancerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      danceObj: null,
      userToRemove: null,
      confirmOpen: false,
      modalOpen: false,
      loading: true
    }
  }

  static propTypes = {
    userInfo: PropTypes.object,
  }

  static defaultProps = {
    userInfo: null
  }

  async componentDidMount() {
    document.title = 'Dancer List';
    const danceResponse = await this.getDancePopulated();

    this.setState({
      danceObj: danceResponse.data,
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

  show = (user) => {
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

  render() {
    const {
      danceObj,
      userToRemove,
      confirmOpen,
      loading
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader content='Loading dancer list...' />
        </Dimmer>
      );
    }
    return (
      <div id='dancer-list'>
        <Header as='h1' style={{ textTransform: 'capitalize' }}>
          {danceObj.name}
        </Header>
        <Header.Subheader style={{ textTransform: 'capitalize' }}>
          {danceObj.level + ' ' + danceObj.style}
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
                    <Icon onClick={() => this.show(user)} className='remove-icon' name='minus circle' color='red' />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell>
          <Button icon size='small' download href={`/reports/dance-final/${danceObj._id}`}>
            <Icon name='download' />
            {' Download CSV'}
          </Button>
              </Table.HeaderCell>
              <Table.HeaderCell className='add-dancer' colSpan='4'>
                <Dropdown
                  text='Add Dancer'
                  icon='add user'
                  floating
                  labeled
                  button
                  search
                  className='icon'
                >
                  <Dropdown.Menu>
                    {/* {friendOptions.map((option) => (
              <Dropdown.Item key={option.value} {...option} />
            ))} */}
                  </Dropdown.Menu>
                </Dropdown>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
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
