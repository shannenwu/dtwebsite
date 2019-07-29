import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
} from 'semantic-ui-react';
import '../modules.css';

class ItemStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  static propTypes = {
    rank: PropTypes.number,
    pref: PropTypes.object,
  }

  static defaultProps = {
  }

  componentDidMount() {
  }

  // consider using shouldComponentUpdate(nextProps, nextState)

  render() {
    const {
      loading,
    } = this.state;

    const {
      rank,
      pref,
    } = this.props;

    // if (loading) {
    //   return (
    //     <Dimmer active inverted>
    //       <Loader></Loader>
    //     </Dimmer>
    //   );
    // }
    return (
      <List.Item>
        <List.Content className="dance-name">
          <span className={pref.status}>
            {rank}
.
            {' '}
            {pref.dance.name}
          </span>
        </List.Content>
      </List.Item>

    );
  }
}

export default ItemStatus;
