import React, { Component } from 'react';
import './static.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
    //   bgUrl: '/site_images/bg/bg1.jpeg',
    };
  }

  render() {
    const {
      bgUrl
    } = this.state;

    return (
      <div id='home-page'>
      </div>
    );
  }
}

export default Home;