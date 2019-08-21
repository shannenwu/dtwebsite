import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Dimmer, Header, List, Loader } from 'semantic-ui-react';
import './choreographer.css';

class ChoreographerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dances: [],
      loading: true,
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
    const { getActiveShow, getDances } = this.props;

    const activeShowResponse = await getActiveShow();
    const dancesResponse = await getDances(activeShowResponse.data._id);

    this.setState({
      dances: dancesResponse.data,
      loading: false,
    });
  }

  render() {
    const {
      dances,
      loading,
    } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted>
          <Loader content='Loading dances...' />
        </Dimmer>
      );
    }
    return (
      <div id='choreographer-page'>
        <Header as='h1'>
          Choreographer
        </Header>
        <List selection divided relaxed verticalAlign='middle' size='big'>
          {dances.map((dance, index) => {
            const selectionLink = `/selection/${dance._id}`;
            const timeLink = `/time/${dance._id}`;
            const listLink = `/list/${dance._id}`;
            var buttons = (
              <Button
                basic
                color='red'
                floated='right'
                content='Selection'
                as={Link}
                to={selectionLink}
              />
            );
            if (dance.selectionComplete) {
              buttons = (
                <React.Fragment>
                  <Button
                    basic
                    color='teal'
                    floated='right'
                    content='Dancer List'
                    as={Link}
                    to={listLink}
                  />
                  <Button
                    basic
                    color='teal'
                    floated='right'
                    content='Availabilities'
                    as={Link}
                    to={timeLink}
                  />
                </React.Fragment>);
            }
            return (
              <List.Item key={index}>
                {buttons}
                <List.Content verticalAlign='middle'>
                  <List.Header>
                    {dance.name}
                  </List.Header>
                  <List.Description>
                    {dance.level + ' ' + dance.style}
                  </List.Description>
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </div>
    );
  }
}

export default ChoreographerPage;
