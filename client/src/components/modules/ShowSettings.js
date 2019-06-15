import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Button, Card, Loader, Checkbox, Icon
} from 'semantic-ui-react';
import axios from 'axios';
import '../../css/app.css';

class ShowSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  static propTypes = {
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  render() {
    const {
    } = this.state;
    const {
        activeShow,
        prefsOpen,
        setActiveShow,
        selectedShow,
        togglePrefs
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
            <Button disabled={false}>Generate</Button>
        </Grid.Row>
        <Grid.Row>
            Late Preference Sheets
            <Icon name="add" link/>
        </Grid.Row>
        <Grid.Row>
            <Button onClick={()=>setActiveShow(selectedShow._id)}>Set selected as active show</Button>
        </Grid.Row>
      </div>
    );
  }
}

export default ShowSettings;
