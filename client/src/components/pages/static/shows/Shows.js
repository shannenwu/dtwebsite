import React, { Component } from 'react';
import { Dimmer, Dropdown, Icon, Loader, Table } from 'semantic-ui-react';
import axios from 'axios';
import { staticShowOptions } from './ShowsConfig';
import { staticShowMap } from './ShowMapConfig';
import '../static.css';
import './shows.css';

class Shows extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedShowKey: 'F19',
      showMap: null,
      showOptions: null,
      loading: true
    }
  }

  async componentDidMount() {
    document.title = 'Shows';
    await this.initializeShowMap();
  }

  initializeShowMap = async () => {
    const response = await axios.get('/api/shows/show-map');

    const showMapAll = { ...response.data.showMap, ...staticShowMap };
    const showOptionsAll = [...response.data.showOptions, ...staticShowOptions];

    this.setState({
      selectedShowKey: showOptionsAll[0].value,
      showMap: showMapAll,
      showOptions: showOptionsAll,
      loading: false
    });
  }

  selectShow = (e, { value }) => {
    this.setState({
      selectedShowKey: value
    });
  }

  render() {
    const { selectedShowKey, showMap, showOptions, loading } = this.state;

    if (loading) {
      return (
        <Dimmer active inverted className='selection-loader'>
          <Loader content='Loading selection...' />
        </Dimmer>
      );
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
            {showMap[selectedShowKey].dances.map((dance, index) => {
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