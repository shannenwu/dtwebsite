import React, { Component } from 'react';
import {
  Header, Grid, Card, Button, Placeholder,
} from 'semantic-ui-react';
import '../modules.css';

class DancerCardPlaceHolder extends Component {
  render() {
    return (
      <Card>
        <Card.Content>
          <Header floated="right">
            <Placeholder>
              <Placeholder.Line length='very short' />
            </Placeholder>
          </Header>
          <Card.Header>
            <Placeholder>
              <Placeholder.Line length='medium' />
            </Placeholder>
          </Card.Header>
          <Card.Meta>
            <Placeholder>
              <Placeholder.Line length='very short' />
            </Placeholder>
          </Card.Meta>
          <Grid stackable centered columns="equal" style={{ minWidth: '100%' }}>
            <Grid.Column className="dancer-image">
              <Placeholder>
                <Placeholder.Image square />
              </Placeholder>
            </Grid.Column>
            <Grid.Column style={{
              height: '145px', overflow: 'auto', paddingLeft: '0', marginRight: '14px',
            }}
            >
              <Placeholder>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder>
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          <Button.Group floated="right">
            <Button disabled icon="check" size="tiny" color="green"
            />
            <Button disabled icon="undo" size="tiny" color="yellow"
            />
            <Button disabled icon="cancel" size="tiny" color="red"
            />
          </Button.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default DancerCardPlaceHolder;
