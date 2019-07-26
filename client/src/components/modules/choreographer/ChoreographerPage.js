import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Link
} from 'react-router-dom';
import axios from 'axios';
import {
  Header, List, Image, Button, Icon, Dimmer, Loader
} from 'semantic-ui-react';

class ChoreographerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dances: [],
      loading: true
    };
  }

  static propTypes = {
    userInfo: PropTypes.object,
    getActiveShow: PropTypes.func,
    getDances: PropTypes.func,
  }

  static defaultProps = {
    userInfo: null,
  }

  componentDidMount() {
    document.title = 'Choreographer';
    this.initializeDances();
  }

  initializeDances = async () => {
    const { getActiveShow, getDances } = this.props

    const activeShowResponse = await getActiveShow();
    const dancesResponse = await getDances(activeShowResponse.data._id);

    this.setState({
      dances: dancesResponse.data,
      loading: false
    });
  }

  render() {
    const {
      dances,
      loading
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader></Loader>
        </Dimmer>
      );
    }
    return (
      <div id="choreographer">
        <Header as="h1">
          Choreographer
        </Header>
        <List divided relaxed verticalAlign='middle' size='big'>
          {dances.map((dance, index) => {
            const selectionLink = "/choreographer/" + dance._id;
            return (
              <List.Item key={index}>
                <Link to="/about" style={{float: 'right'}}><Icon link name="address book" /></Link>
                <Link to="/about" style={{float: 'right'}}><Icon link name="calendar alternate outline" /></Link>
                <Link to={selectionLink} style={{float: 'right'}}><Icon link name="edit outline" /></Link>
                <List.Content>
                  {dance.name}
                </List.Content>
              </List.Item>
            )
          })}
        </List>
      </div>
    );
  }
}

export default ChoreographerPage;