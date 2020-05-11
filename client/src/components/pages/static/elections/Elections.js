import React, { Component } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { electionsData } from './ElectionsConfig';
import '../static.css';
import './elections.css';

class Elections extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = 'Elections';
  }

  render() {
    return (
      <div className='static-page'>
        <h1>Elections</h1>
        <div id='show-description'>
          <p>
            Due to the current situation, DT has moved elections online. Please <a className='link-name' href='https://www.youtube.com/playlist?list=PLZ7FwvI8aqZPdAnBsNjjJuveGCBjh-Lxo'>watch</a> all the platforms and pros for each of the candidates and vote in the link that Caela has sent out! All current members of DT are required to vote. Voting is an important task as this will decide the new exec board for DT next year. You can find the entire comprehensive playlist <a className='link-name' href='https://www.youtube.com/playlist?list=PLZ7FwvI8aqZPdAnBsNjjJuveGCBjh-Lxo'>here</a>.
        </p>
        </div>
        <Table basic='very' celled selectable padded>
          <Table.Header className='show-header'>
            <Table.Row>
              <Table.HeaderCell>Position</Table.HeaderCell>
              <Table.HeaderCell>Candidates</Table.HeaderCell>
              <Table.HeaderCell>Platforms</Table.HeaderCell>
              <Table.HeaderCell>Pros</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {electionsData.positions.map((position, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{position.name}</Table.Cell>
                  <Table.Cell>{position.candidates.map(candidate => <p>{candidate}<br /></p>)}</Table.Cell>
                  <Table.Cell>
                    <iframe src={position.platforms}
                      width="280" height="155" frameborder="0" allowfullscreen></iframe>
                  </Table.Cell>
                  <Table.Cell>
                    {position.pros !== '' ? (
                      <iframe src={position.pros}
                        width="280" height="155" frameborder="0" allowfullscreen></iframe>
                    ) : (
                        <div>
                          N/A (unopposed)
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

export default Elections;