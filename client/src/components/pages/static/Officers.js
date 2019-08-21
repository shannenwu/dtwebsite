import React from 'react';
import './static.css';

const Officers = () => (
  <div id='officers'>
    <h1>OFFICERS</h1>
    <p>Contact us at <a className='link-name' href='mailto:dt-officers@mit.edu'>dt-officers@mit.edu</a>!</p>
    <div className='officers-grid'>
      <div className='single'>
        <div className='img' style={{ backgroundImage: `url('/site_images/default-profile.jpeg')` }}></div>
        <div className='about'></div>
      </div>
      <div className='single'>
        <div className='img' style={{ backgroundImage: `url('/site_images/default-profile.jpeg')` }}></div>
        <div className='about'></div>
      </div>
      <div className='single'>
        <div className='img' style={{ backgroundImage: `url('/site_images/default-profile.jpeg')` }}></div>
        <div className='about'></div>
      </div>
      <div className='single'>
        <div className='img' style={{ backgroundImage: `url('/site_images/default-profile.jpeg')` }}></div>
        <div className='about'></div>
      </div>
      <div className='single'>
        <div className='img' style={{ backgroundImage: `url('/site_images/default-profile.jpeg')` }}></div>
        <div className='about'></div>
      </div>
      <div className='single'>
        <div className='img' style={{ backgroundImage: `url('/site_images/default-profile.jpeg')` }}></div>
        <div className='about'></div>
      </div>
    </div>
  </div>
);

export default Officers;