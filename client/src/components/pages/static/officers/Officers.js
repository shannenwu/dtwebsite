import React from 'react';
import { officerOptions } from './OfficersConfig';
import '../static.css';
import './officers.css';

const Officers = () => (
  <div className='static-page' id='officers'>
    <h1>Officers</h1>
    <p>Contact us at <a className='link-name' href='mailto:dt-officers@mit.edu'>dt-officers@mit.edu</a>.</p>
    <div className='officers-grid'>
      {officerOptions.map((officer, index) => {
        return (
          <div key={index} className='single'>
            <div className='img' style={{ backgroundImage: `url(${officer.photoUrl})` }}></div>
            <div className='about'>
              <div className='name'>
                {officer.name}
              </div>
              <div className='position'>
                {officer.position}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
);

export default Officers;