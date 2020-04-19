import React, { Component } from 'react';
import './static.css';

class Home extends Component {

  componentDidMount() {
    document.title = 'Home';
  }

  render() {
    return (
      <div id='home-page'>
        <div className='quote'>DanceTroupe is one of the largest dance organizations at MIT, bringing a unique variety of styles to the community.</div>
      </div>
    );
  }
}

export default Home;