import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Header, Dimmer, Loader, Table, Dropdown } from 'semantic-ui-react';
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
        <Header as='h1' content={danceObj.name} />
        <Dropdown
          name="newUser"
          selection
          search
          scrolling
          upward={false}
          // options={userOptions}
          // value={choreographers || []}
          // onChange={this.handleChange}
        />
        <Table basic selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>First Name</Table.HeaderCell>
              <Table.HeaderCell>Last Name</Table.HeaderCell>
              <Table.HeaderCell>Year</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {danceObj.acceptedDancers.map((user, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{user.firstName}</Table.Cell>
                  <Table.Cell>{user.lastName}</Table.Cell>
                  <Table.Cell>{user.year}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
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
