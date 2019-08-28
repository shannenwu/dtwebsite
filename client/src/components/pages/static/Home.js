import React, { Component } from 'react';
import './static.css';

class Home extends Component {

  componentDidMount() {
    document.title = 'Home';
  }

  render() {
    return (
      <div id='home-page'>
        <div className='quote'>DanceTroupe is the largest dance organization at MIT, bringing a variety of styles to the community.</div>
      </div>
    );
  }
}

export default Home;