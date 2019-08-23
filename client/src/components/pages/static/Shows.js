import React, { Component } from 'react';
import { Dropdown, Header, Table } from 'semantic-ui-react';
import { showOptions } from './ShowsConfig';
import { showMap } from './ShowMapConfig';
import './static.css';

class Shows extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedShowKey: 'S19',
      showMap: null,
      loading: true
    }
  }

  static propTypes = {
  }

  static defaultProps = {
  }

  componentDidMount() {

  }

  selectShow = (e, { value }) => {
    this.setState({
      selectedShowKey: value
    });
  }

  render() {
    const { selectedShowKey, loading } = this.state;
    var dances = [];
    var playlistUrl = '';
    if (showMap.hasOwnProperty(selectedShowKey)) {
      dances = showMap[selectedShowKey].dances;
      playlistUrl = showMap[selectedShowKey].playlistUrl;
    }

    return (
      <div className='static-page'>
        <h1>Shows</h1>
        <div id='show-description'>
          <p>
            Our shows are some of the most highly anticipated and well-attended events on campus.
            We showcase a variety of dance styles, such as hip hop, contemporary, tap, jazz, and more!
        </p>
          <span>
            Currently viewing{' '}
            <Dropdown
              inline
              options={showOptions}
              value={selectedShowKey}
              onChange={this.selectShow}
            />
          </span>
          <div>Watch dance snippets <a className='link-name' target='_blank' href={playlistUrl}>here</a>!</div>
        </div>
        <Table basic='very' celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Style</Table.HeaderCell>
              <Table.HeaderCell>Level</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {dances.map((dance, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{dance.name}</Table.Cell>
                  <Table.Cell>{dance.style}</Table.Cell>
                  <Table.Cell>{dance.level}</Table.Cell>
                  <Table.Cell>{dance.description}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default Shows;
