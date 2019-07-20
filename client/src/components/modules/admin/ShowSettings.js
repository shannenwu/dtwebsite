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
      confirmOpen: false,
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
    userOptions: PropTypes.array
  }

  // TODO implement changes to handle late prefs
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  showConfirmation = () => this.setState({ confirmOpen: true });

  handleConfirm = async () => {
    const { generateAuditionNumbers } = this.props;
    const response = await generateAuditionNumbers(); // TODO handle response
    this.setState({ 
      confirmOpen: false 
    });
  }

  handleCancel = () => this.setState({ confirmOpen: false });

  handleOpen = () => this.setState({ latePrefOpen: true });

  handleClose = () => this.setState({ latePrefOpen: false });


  render() {
    const {
      confirmOpen,
      latePrefOpen
    } = this.state;
    const {
        activeShow,
        prefsOpen,
        setActiveShow,
        selectedShow,
        togglePrefs,
        userOptions
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
            <Button onClick={this.showConfirmation}>Generate</Button>
            <Confirm 
              open={confirmOpen} 
              content='This will generate new audition numbers for all prefsheets in the active show. Proceed?'
              confirmButton="Yes"
              onCancel={this.handleCancel} 
              onConfirm={this.handleConfirm} 
            />
        </Grid.Row>
        <Grid.Row>
            <Button onClick={()=>setActiveShow(selectedShow._id)}>Set selected as active show</Button>
        </Grid.Row>
        <Grid.Row>
            Late Preference Sheets
            <div onClick={this.handleOpen}><Icon link name="add" /></div>
            <LatePrefsheetModal userOptions={userOptions} open={latePrefOpen} handleClose={this.handleClose} activeShow={activeShow} />
        </Grid.Row>
      </div>
    );
  }
}

export default ShowSettings;
