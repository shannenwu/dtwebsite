import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Header, Icon, Label
} from 'semantic-ui-react';
import ShowModal from './ShowModal';
import './show.css';

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
      selectShow
    } = this.props;

    return (
      <div>
        <Header as='h3'>
          Shows
          <Icon onClick={this.handleOpen} link name='plus' style={{float: 'right', fontSize: '1em'}}/>
        </Header>
        <ShowModal open={modalOpen} handleClose={this.handleClose} />
        {shows.map((showObj) => {
          const pre = showObj.semester === 'fall' ? 'F' : 'S';
          const yr = showObj.year.toString().substring(2);
          const className = showObj === selectedShow ? 'show-selected' : '';
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
                    <Label color='green' style={{ float: 'right' }}>
                      ACTIVE
                    </Label>
                  ) : <div />}
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
