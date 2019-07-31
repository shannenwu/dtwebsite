import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
} from 'semantic-ui-react';
import ItemStatus from './ItemStatus';
import '../modules.css';

class PrefList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true, // nuke?
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
      loading,
    } = this.state;

    const {
      rankedDances,
    } = this.props;

    // if (loading) {
    //   return (
    //     <Dimmer active inverted>
    //       <Loader></Loader>
    //     </Dimmer>
    //   );
    // }
    return (
      <List verticalAlign="middle" size="small">
        {rankedDances.map((pref, index) => <ItemStatus key={index} rank={index + 1} pref={pref} />)}
      </List>
    );
  }
}

export default PrefList;
