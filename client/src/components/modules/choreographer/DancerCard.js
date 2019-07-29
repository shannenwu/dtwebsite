import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Header, Card, Grid, Image, Button, Icon, Dimmer, Loader,
} from 'semantic-ui-react';
import PrefList from './PrefList';
import '../modules.css';

class DancerCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true, // need? idk
    };
  }

  static propTypes = {
    isActionable: PropTypes.bool,
    isAccepted: PropTypes.bool,
    isReturn: PropTypes.bool,
    prefsheet: PropTypes.object.isRequired,
    stats: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isActionable: true,
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
      isActionable,
      isAccepted,
      isReturn,
      handleStatusUpdate,
      prefsheet,
      stats
    } = this.props;

    // if (loading) {
    //   return (
    //     <Dimmer active inverted>
    //       <Loader></Loader>
    //     </Dimmer>
    //   );
    // }
    return (
      <Card className={`dancer-card ${isActionable ? '' : 'inactionable'}`}>
        <Card.Content>
          <Header floated="right">{prefsheet.auditionNumber}</Header>
          <Card.Header>{`${prefsheet.user.firstName} ${prefsheet.user.lastName}`}</Card.Header>
          <Card.Meta>{prefsheet.user.year}</Card.Meta>
          <Grid stackable centered columns="equal" style={{ minWidth: '100%' }}>
            <Grid.Column className="dancer-image">
              <Image
                size="small"
                src={`/profile_images/${prefsheet.user._id.toString()}.jpeg`}
                onError={this.addDefaultImage}
              />
            </Grid.Column>
            <Grid.Column style={{
              height: '145px', overflow: 'auto', paddingLeft: '0', marginRight: '14px',
            }}
            >
              <PrefList rankedDances={prefsheet.rankedDances} />
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          Max:
          {' '}
          {prefsheet.maxDances}
          <Button.Group floated="right">
            <Button
              disabled={isAccepted || !isActionable}
              icon="check"
              size="tiny"
              color="green"
              onClick={() => handleStatusUpdate(prefsheet._id, 'accepted', stats.actionableDances)}
            />
            <Button
              disabled={
                isReturn || 
                !isActionable || 
                (stats.numAccepted > 0 && stats.status !== 'accepted') ||
                (stats.numAccepted - 1 > 0 && stats.status === 'accepted')
              }
              icon="undo"
              size="tiny"
              color="yellow"
              onClick={() => handleStatusUpdate(prefsheet._id, 'return', stats.actionableDances)}
            />
            <Button
              disabled={!isActionable}
              icon="cancel"
              size="tiny"
              color="red"
              onClick={() => handleStatusUpdate(prefsheet._id, 'rejected', stats.actionableDances)}
            />
          </Button.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default DancerCard;
