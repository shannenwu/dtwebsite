import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
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
            Due to the current situation, DT has moved elections online. We've tried to mimic the normal process as closely as possible, with platforms, questions, and pros, as these are all important for making a decision about a candidate. Please watch all the platforms and pros for each of the candidates carefully and vote in this <a className='link-name' href='https://forms.gle/hx9Vm3RAiY2LQvTx9' target="_blank">form</a>. All current members of DT are required to vote. Voting is an important task as this will decide the new exec board for DT next year. You can find the entire comprehensive playlist <a className='link-name' href='https://www.youtube.com/playlist?list=PLZ7FwvI8aqZPdAnBsNjjJuveGCBjh-Lxo' target="_blank">here</a>.
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
                      width="280" height="155" frameBorder="0" allowFullScreen></iframe>
                  </Table.Cell>
                  <Table.Cell>
                    {position.pros !== '' ? (
                      <iframe src={position.pros}
                        width="280" height="155" frameBorder="0" allowFullScreen></iframe>
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