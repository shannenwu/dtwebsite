import React from 'react';
import {
  Grid, Header, Form, Button, Icon, Card, Loader
} from 'semantic-ui-react';
import DanceModal from './DanceModal';
import axios from 'axios';
import '../../css/app.css';

class DanceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      loading: false, // change later
      dances: []
    };
  }

  componentDidMount() {
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.setState({
      modalOpen: false,
    });
  }

  render() {
    const {
      modalOpen,
      loading,
      dances
    } = this.state;
    const {
    } = this.props;

      return (
        <div>
          <Header as="h3">
            Dances
          </Header>
          <div onClick={this.handleOpen}><Icon link name="add" /></div>
          <DanceModal open={modalOpen} handleClose={this.handleClose} />
          {loading ? <Loader></Loader> : (
            dances.map(danceObj => {
            //   var pre = showObj.semester === 'fall' ? 'F' : 'S';
            //   var yr = showObj.year.toString().substring(2);
            //   var className = showObj._id === selectedShow ? 'selected' : '';
              return <Card 
                key={danceObj._id}
                className={className}
                // onClick={() => selectShow(showObj._id)}
                >
                  <Card.Content>
                  {/* {pre+yr+' | '+showObj.name} */}
                  </Card.Content>
                </Card>
            })
          )}
        </div>
      );
      
  }
}

export default DanceList;
