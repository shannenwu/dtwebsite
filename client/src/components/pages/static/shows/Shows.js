import React, { Component } from 'react';
import { Dropdown, Icon, Table } from 'semantic-ui-react';
import { showOptions } from './ShowsConfig';
import { showMap } from './ShowMapConfig';
import '../static.css';

class Shows extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedShowKey: 'S19',
      showMap: null,
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
        </div>
        <Table basic='very' celled selectable padded>
          <Table.Header>
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
                    {dance.hasOwnProperty('note') && (
                      <div>
                        <br></br>
                        <div style={{ fontWeight: 'bold' }}>
                          *{dance.note}
                        </div>
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell style={{ textAlign: 'center' }}>
                    <a href={dance.videoUrl} target='_blank' >
                      <Icon name='youtube' link />
                    </a>
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