import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Header, Dimmer, Loader, Table, Button, Icon } from 'semantic-ui-react';
class DancerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      danceObj: null,
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
    const danceResponse = await this.getAcceptedDancers();

    this.setState({
      danceObj: danceResponse.data,
      loading: false
    })
  }

  getAcceptedDancers = async () => {
    try {
      const response = await axios.get(`/api/dances/accepted-dancers/${this.props.match.params.danceId}`);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  getSingleDance = async (danceId) => {
    try {
      const danceResponse = await axios.get(`/api/dances/${danceId}`);
      return danceResponse;
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const {
      danceObj,
      loading
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      );
    }
    return (
      <div>
        <Button disabled floated='right' icon labelPosition='left' primary size='small'>
          <Icon name='user' /> Add Dancer
        </Button>
        <Button icon floated='right' size='small' download href={`/reports/dance-final/${danceObj._id}`}>
          <Icon name='download' />
        </Button>
        <Header as='h1'>
          {danceObj.name}
        </Header>
        <Header.Subheader>{danceObj.level + ' ' + danceObj.style}</Header.Subheader>
        <Table basic selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>First Name</Table.HeaderCell>
              <Table.HeaderCell>Last Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Year</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {danceObj.acceptedDancers.map((user, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{user.firstName}</Table.Cell>
                  <Table.Cell>{user.lastName}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.year}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default DancerList;
