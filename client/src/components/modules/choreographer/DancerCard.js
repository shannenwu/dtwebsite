import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Header, Card, Grid, Image, Button, Icon, Dimmer, Loader
} from 'semantic-ui-react';
import PrefList from './PrefList';
import '../modules.css';

class DancerCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true // need? idk
    };
  }

  static propTypes = {
    isAccepted: PropTypes.bool,
    isReturn: PropTypes.bool,
    data: PropTypes.object
  }

  static defaultProps = {
    isAccepted: false,
    isReturn: false,
  }

  componentDidMount() {
  }

  addDefaultImage = (e) => {
    e.target.src = 'https://react.semantic-ui.com/images/avatar/large/matthew.png';
  }

  render() {
    const {
    } = this.state;

    const {
      isAccepted,
      isReturn,
      handleStatusUpdate,
      data
    } = this.props;

    // if (loading) {
    //   return (
    //     <Dimmer active inverted>
    //       <Loader></Loader>
    //     </Dimmer>
    //   );
    // }
    return (
      <Card className="dancer-card">
        <Card.Content>
          <Header floated="right">{data.auditionNumber}</Header>
          <Card.Header>{data.user.firstName + " " + data.user.lastName}</Card.Header>
          <Card.Meta>{data.user.year}</Card.Meta>
          <Grid stackable centered columns='equal' style={{ minWidth: '100%' }}>
            <Grid.Column className="dancer-image">
              <Image 
                size='small' 
                src={`/profile_images/${data.user._id.toString()}.jpeg`}
                onError={this.addDefaultImage}
              />
            </Grid.Column>
            <Grid.Column style={{ height: '145px', overflow: 'auto', paddingLeft: '0', marginRight: '14px' }}>
              <PrefList rankedDances={data.rankedDances} />
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          Max: {data.maxDances}
          <Button.Group floated="right">
            <Button
              disabled={isAccepted}
              icon='check'
              size='tiny'
              color='green' 
              onClick={() => handleStatusUpdate(data._id, 'accepted')}
            >
            </Button>
            <Button
              disabled={isReturn}
              icon='undo'
              size='tiny'
              color='yellow'
              onClick={() => handleStatusUpdate(data._id, 'return')}
            >
            </Button>
            <Button
              icon='cancel'
              size='tiny'
              color='red'
              onClick={() => handleStatusUpdate(data._id, 'rejected')}
            >
            </Button>
          </Button.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default DancerCard;