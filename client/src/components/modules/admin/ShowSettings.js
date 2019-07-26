import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Button, Loader, Checkbox, Icon, Confirm
} from 'semantic-ui-react';
import LatePrefsheetModal from './LatePrefsheetModal';
import axios from 'axios';
import './admin.css';

class ShowSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmAuditionNumOpen: false,
      confirmPermissionsOpen: false,
      latePrefOpen: false
    };
  }

  componentDidMount() {
  }

  static propTypes = {
    activeShow: PropTypes.object,
    setActiveShow: PropTypes.func,
    selectedShow: PropTypes.object,
    prefsOpen: PropTypes.bool,
    togglePrefs: PropTypes.func,
    generateAuditionNumbers: PropTypes.func,
    userOptions: PropTypes.array,
    danceOptions: PropTypes.array
  }

  // TODO implement changes to handle late prefs
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  showAuditionNumConfirmation = () => this.setState({ confirmAuditionNumOpen: true });

  showPermissionsConfirmation = () => this.setState({ confirmPermissionsOpen: true });

  // TODO set responses for error or success 
  handleConfirmAuditionNumbers = async () => {
    const { generateAuditionNumbers } = this.props;
    const response = await generateAuditionNumbers(); // TODO handle response
    this.setState({ 
      confirmAuditionNumOpen: false 
    });
  }

  handleConfirmChoreographers = async () => {
    const response = await axios.post('/api/permissions/choreographers'); // TODO handle response
    this.setState({ 
      confirmPermissionsOpen: false 
    });
  }

  handleCancel = () => this.setState({ confirmAuditionNumOpen: false, confirmPermissionsOpen: false });

  handleOpen = () => this.setState({ latePrefOpen: true });

  handleClose = () => this.setState({ latePrefOpen: false });


  render() {
    const {
      confirmAuditionNumOpen,
      confirmPermissionsOpen,
      latePrefOpen
    } = this.state;
    const {
        activeShow,
        prefsOpen,
        setActiveShow,
        selectedShow,
        togglePrefs,
        userOptions,
        danceOptions
    } = this.props;

    return (
      <div>
        <Header as="h3">
            Show Settings
        </Header>
        <Grid.Row>
            Preference Sheets
            <Checkbox onClick={()=>togglePrefs()} checked={prefsOpen} toggle />
        </Grid.Row>
        <Grid.Row>
            Audition Numbers
            <Button onClick={this.showAuditionNumConfirmation}>Generate</Button>
            <Confirm 
              open={confirmAuditionNumOpen} 
              content='This will generate new audition numbers for all prefsheets in the active show. Proceed?'
              confirmButton="Yes"
              onCancel={this.handleCancel} 
              onConfirm={this.handleConfirmAuditionNumbers} 
            />
        </Grid.Row>
        <Grid.Row>
            <Button onClick={()=>setActiveShow(selectedShow._id)}>Set selected as active show</Button>
        </Grid.Row>
        <Grid.Row>
            Late Preference Sheets
            <div onClick={this.handleOpen}><Icon link name="add" /></div>
            <LatePrefsheetModal userOptions={userOptions} danceOptions={danceOptions} open={latePrefOpen} handleClose={this.handleClose} activeShow={activeShow} />
        </Grid.Row>
        <Grid.Row>
            <Button onClick={this.showPermissionsConfirmation}>Update Choreographer Permissions</Button>
            <Confirm 
              open={confirmPermissionsOpen} 
              content='This will give/revoke choreographer permissions for dances in the active show. Proceed?'
              confirmButton="Yes"
              onCancel={this.handleCancel} 
              onConfirm={this.handleConfirmChoreographers} 
            />
        </Grid.Row>
      </div>
    );
  }
}

export default ShowSettings;
