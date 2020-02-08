import React, { Component } from 'react';
import { Dropdown, Icon, Table } from 'semantic-ui-react';
import { showOptions } from './ShowsConfig';
import { showMap } from './ShowMapConfig';
import '../static.css';
import './shows.css';

class Shows extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedShowKey: 'F19',
      showMap: null,
    }
  }

  componentDidMount() {
    document.title = 'Shows';
  }

  selectShow = (e, { value }) => {
    this.setState({
      selectedShowKey: value
    });
  }

  render() {
    const { selectedShowKey } = this.state;
    var dances = [];
    if (showMap.hasOwnProperty(selectedShowKey)) {
      dances = showMap[selectedShowKey].dances;
    }

    return (
      <div className='static-page'>
        <h1>Shows</h1>
        <div id='show-description'>
          <p>
            Our shows are some of the most highly anticipated and well-attended events on campus.
            We showcase a variety of dance styles, such as urban, contemporary, tap, jazz, and more!
        </p>
          <span>
            Currently viewing{' '}
            <Dropdown
              inline
              options={showOptions}
              value={selectedShowKey}
              direction='left'
              onChange={this.selectShow}
              className='show-dropdown'
            />
          </span>
        </div>
        <Table basic='very' celled selectable padded>
          <Table.Header className='show-header'>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Style</Table.HeaderCell>
              <Table.HeaderCell>Level</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Video</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {dances.map((dance, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{dance.name}</Table.Cell>
                  <Table.Cell>{dance.style}</Table.Cell>
                  <Table.Cell>{dance.level}</Table.Cell>
                  <Table.Cell>
                    {dance.description}
                    {dance.hasOwnProperty('auditionNote') && (
                      <div>
                        <br></br>
                        <div style={{ fontWeight: 'bold' }}>
                          *{dance.auditionNote}
                        </div>
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell style={{ textAlign: 'center' }}>
                    {dance.videoUrl !== '' ? (
                      <a href={dance.videoUrl} target='_blank' >
                        <Icon name='youtube' link />
                      </a>
                    ) : (
                        <div>
                          N/A
                      </div>
                      )}
                  </Table.Cell>
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