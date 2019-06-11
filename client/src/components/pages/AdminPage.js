import React from 'react';
import {
  Grid, Header, Form, Button, Modal, Icon
} from 'semantic-ui-react';
import ShowList from '../modules/ShowList';
import axios from 'axios';

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shows: [],
      dances: []
    };
  }

  componentDidMount() {
    document.title = "Admin Page";
    // make get request to load shows, dances
  }


  render() {
    const {
    } = this.state;

    return (
      <React.Fragment>
        <Header as="h1">
          Administrative Options
        </Header>
        <Grid padded columns={3} style={{height: '100%'}}>
          <Grid.Column>
            <ShowList/>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3">
              Dances
            </Header>
          </Grid.Column>
          <Grid.Column stretched>
            <Grid.Row style={{height: '50%'}}>
              <Header as="h3">
                Dancers
              </Header>
            </Grid.Row>
            <Grid.Row style={{height: '50%'}}>
              <Header as="h3">
                Show Settings
              </Header>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default AdminPage;
