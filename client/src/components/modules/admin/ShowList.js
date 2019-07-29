import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Header, Form, Button, Icon, Card, Loader, Label,
} from 'semantic-ui-react';
import axios from 'axios';
import ShowModal from './ShowModal';
import './admin.css';

class ShowList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };
  }

  componentDidMount() {
  }

  static propTypes = {
    shows: PropTypes.array,
    selectedShow: PropTypes.object,
    selectShow: PropTypes.func,
    activeShow: PropTypes.object,
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
    } = this.state;
    const {
      shows,
      selectedShow,
      selectShow,
      handleDeleteShow,
    } = this.props;

    return (
      <div>
        <Header as="h3">
          Shows
        </Header>
        <div onClick={this.handleOpen}><Icon link name="add" /></div>
        <ShowModal open={modalOpen} handleClose={this.handleClose} />
        {shows.map((showObj) => {
          const pre = showObj.semester === 'fall' ? 'F' : 'S';
          const yr = showObj.year.toString().substring(2);
          const className = showObj === selectedShow ? 'selected' : '';
          return (
            <Card
              key={showObj._id}
              className={className}
              onClick={() => selectShow(showObj)}
            >
              <Card.Content>
                {`${pre + yr} | ${showObj.name}`}
                {showObj.isActive
                  ? (
                    <Label color="green">
                    ACTIVE
                    </Label>
                  ) : <div />}
                {/* this delete icon needs a confirmation before we delete everything  lol */}
                {/* <Icon name='cancel' link onClick={() => handleDeleteShow(showObj._id)} /> */}
              </Card.Content>
            </Card>
          );
        })
        }
      </div>
    );
  }
}

export default ShowList;
