import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import ItemStatus from './ItemStatus';
import './card.css';

class PrefList extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static propTypes = {
    rankedDances: PropTypes.array.isRequired,
  }

  static defaultProps = {
  }

  componentDidMount() {
  }

  render() {
    const {
      rankedDances,
    } = this.props;

    return (
      <List verticalAlign='middle' size='small'>
        {rankedDances.map((pref, index) => <ItemStatus key={index} rank={index + 1} pref={pref} />)}
      </List>
    );
  }
}

export default PrefList;
