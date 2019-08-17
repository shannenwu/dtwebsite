import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Grid, Header, Button, Checkbox, Icon, Confirm, Dropdown
} from 'semantic-ui-react';
import axios from 'axios';
import LatePrefsheetModal from './LatePrefsheetModal';
import './settings.css';

const downloadOptions = [
  {
    key: 'Dance Descriptions',
    text: 'Dance Descriptions',
    value: '/reports/master-dances',
  },
  {
    key: 'Audition Emails',
    text: 'Audition Emails',
    value: '/reports/master-audition-emails',
  },
  {
    key: 'Audition # Assignments',
    text: 'Audition # Assignments',
    value: '/reports/master-assignments',
  },
  {
    key: 'Dance Audition Sheets',
    text: 'Dance Audition Sheets',
    value: '/reports/dance-audition-sheets',
  },
  {
    key: 'Master Dancer/Email List',
    text: 'Master Dancer/Email List',
    value: '/reports/master-final',
  },
]

class ShowSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmAuditionNumOpen: false,
      confirmPermissionsOpen: false,
      latePrefOpen: false,
      downloadLink: '/reports/master-dances'
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
    prodConflictsOpen: PropTypes.bool,
    toggleProdConflicts: PropTypes.func,
    generateAuditionNumbers: PropTypes.func,
    userOptions: PropTypes.array,
    danceOptions: PropTypes.array,
  }

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
      confirmAuditionNumOpen: false,
    });
  }

  handleConfirmChoreographers = async () => {
    const response = await axios.post('/api/permissions/choreographers'); // TODO handle response
    this.setState({
      confirmPermissionsOpen: false,
    });
  }

  handleCancel = () => this.setState({ confirmAuditionNumOpen: false, confirmPermissionsOpen: false });

  handleOpen = () => this.setState({ latePrefOpen: true });

  handleClose = () => this.setState({ latePrefOpen: false });

  handleDownloadChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  render() {
    const {
      confirmAuditionNumOpen,
      confirmPermissionsOpen,
      latePrefOpen,
      downloadLink
    } = this.state;
    const {
      activeShow,
      prefsOpen,
      setActiveShow,
      selectedShow,
      togglePrefs,
      prodConflictsOpen,
      toggleProdConflicts,
      userOptions,
      danceOptions,
    } = this.props;

    return (
      <div id="show-settings">
        <Header as="h3">
          Show Settings
        </Header>
        <Grid.Row>
          Late Preference Sheets
          <Icon onClick={this.handleOpen} link name="add" style={{ float: 'right' }} />
          <LatePrefsheetModal userOptions={userOptions} danceOptions={danceOptions} open={latePrefOpen} handleClose={this.handleClose} activeShow={activeShow} />
        </Grid.Row>
        <Grid.Row>
          Preference Sheets
          <Checkbox onClick={() => togglePrefs()} checked={prefsOpen} toggle style={{ float: 'right' }} />
        </Grid.Row>
        <Grid.Row>
          Prod Week Conflicts
          <Checkbox onClick={() => toggleProdConflicts()} checked={prodConflictsOpen} toggle style={{ float: 'right' }} />
        </Grid.Row>
        <Grid.Row>
          <Button onClick={this.showAuditionNumConfirmation}>Generate Audition Numbers</Button>
          <Confirm
            open={confirmAuditionNumOpen}
            content="This will generate new audition numbers for all prefsheets in the active show. Proceed?"
            confirmButton="Yes"
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirmAuditionNumbers}
          />
        </Grid.Row>
        <Grid.Row>
          <Button onClick={() => setActiveShow(selectedShow._id)}>Set selected as active show</Button>
        </Grid.Row>
        <Grid.Row>
          <Button onClick={this.showPermissionsConfirmation}>Update Choreographer Permissions</Button>
          <Confirm
            open={confirmPermissionsOpen}
            content="This will give/revoke choreographer permissions for dances in the active show. Proceed?"
            confirmButton="Yes"
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirmChoreographers}
          />
        </Grid.Row>
        <Grid.Row>
          <Button
            content='View All Prefsheets'
            as={Link}
            to={'/all-prefsheets'}
          />
        </Grid.Row>
        <Grid.Row>
          <span>
            Download {' '}
            <Dropdown
              name="downloadLink"
              inline
              options={downloadOptions}
              value={downloadLink}
              onChange={this.handleDownloadChange}
            />
            <a href={downloadLink} download>
              <Icon name='download' />
            </a>
          </span>
        </Grid.Row>
      </div>
    );
  }
}

export default ShowSettings;
