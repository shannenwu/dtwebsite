import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List, Popup
} from 'semantic-ui-react';
import '../modules.css';

class ItemStatus extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    rank: PropTypes.number.isRequired,
    pref: PropTypes.object.isRequired,
  }

  static defaultProps = {
  }

  componentDidMount() {
  }

  render() {
    const {
      rank,
      pref,
    } = this.props;

    return (
      <Popup
        content={pref.dance.name}
        size='small'
        position='top center'
        inverted
        trigger={
          <List.Item>
            <List.Content className="dance-name">
              <span className={pref.status}>
                {rank}
                .
                {' '}
                {pref.dance.name}
              </span>
            </List.Content>
          </List.Item>}
      />
    );
  }
}

export default ItemStatus;
