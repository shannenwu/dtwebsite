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
      loading: false
    };
  }

  static propTypes = {
    danceObj: PropTypes.object.isRequired,
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

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.prefsheet) !== JSON.stringify(this.props.prefsheet)) {
      console.log('hello');
    }
  }

  addDefaultImage = (e) => {
    e.target.src = 'https://react.semantic-ui.com/images/avatar/large/matthew.png';
  }

  handleStatusUpdate = async (prefsheetId, update) => {
    const { danceObj } = this.props;
    this.setState({
      loading: true
    })
    const response =
      await axios.post(`/api/prefsheets/auditions/${danceObj._id}/${prefsheetId}`, {
        status: update
      });

    this.setState({
      loading: false
    })
    return response.data; // TODO ERROR HANDLING quick popup
  }

  render() {
    const {
      loading
    } = this.state;

    const {
      isActionable,
      isAccepted,
      isReturn,
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
        <Dimmer active={loading} inverted>
          <Loader content='Updating' />
        </Dimmer>
        <Card.Content>
          <Header floated="right">{prefsheet.auditionNumber}</Header>
          <Card.Header>{`${prefsheet.user.firstName} ${prefsheet.user.lastName}`}</Card.Header>
          <Card.Meta>{prefsheet.user.year}</Card.Meta>
          <Grid stackable centered columns="equal" style={{ minWidth: '100%' }}>
            <Grid.Column className="dancer-image">
              <Image
                size="small"
                src={prefsheet.user.imageUrl}
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
              onClick={() => this.handleStatusUpdate(prefsheet._id, 'accepted')}
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
              onClick={() => this.handleStatusUpdate(prefsheet._id, 'return')}
            />
            <Button
              disabled={!isActionable}
              icon="cancel"
              size="tiny"
              color="red"
              onClick={() => this.handleStatusUpdate(prefsheet._id, 'rejected')}
            />
          </Button.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default DancerCard;
