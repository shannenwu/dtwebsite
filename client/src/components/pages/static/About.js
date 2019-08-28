import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './static.css';

class About extends Component {
  componentDidMount() {
    document.title = 'About';
  }
  
  render () {
    return (
      <div className='static-page'>
        <h1>About</h1>
        <p>
          Founded in 1994, the MIT DanceTroupe is the largest dance organization at the Massachusetts Institute of Technology. We are a student-run group dedicated to bringing a variety of dance styles to everyone in the MIT community, regardless of level. Every semester, we offer various dance workshops to our members and produce one full length show.
        </p>
    
        <h3>Membership</h3>
        <p>
          Membership is open to everyone, regardless of experience level. We welcome undergraduate and graduate students, alumni, staff, and anyone else in the area interested in dance. Membership dues are $5 per semester. Paying dues allows members to attend unlimited DanceTroupe workshops and participate in the shows. (Show participation depends on audition.)
        </p>
    
        <h3>Officers</h3>
        <p>
          DanceTroupe is run entirely by a group of student officers, all of whom are elected by the members of DanceTroupe. Officer terms are one year (two semesters), and there are no term limits. To contact officers, email <a className='link-name' href='mailto:dt-officers@mit.edu'>dt-officers@mit.edu</a>. Current officers may be found on the <Link className='link-name' to='/officers'>officers page</Link>.
        </p>
    
        <h3>Workshops</h3>
        <p>
        DanceTroupe offers workshops of different styles and levels to all of its members throughout the year. No audition or experience is required to attend! Check our <a className='link-name' href='https://www.facebook.com/mitdancetroupe/' target='_blank'>facebook page</a> for our workshop schedules!
        </p>
    
        <h3>Show</h3>
        <p>
        DanceTroupe produces one full-length <Link className='link-name' to='/shows'>show</Link> every semester, with five performances at the end of the semester. Our shows are made up of dances choreographed by students, and include dance styles such as urban, jazz, ballet, tap, modern, and more. All members who want to participate in the show must attend <Link className='link-name' to='/auditions'>auditions</Link>, which take place at the beginning of each semester. 
        </p>
        <p>
        Members may participate in up to four dances, with one hour of weekly rehearsal per dance. In addition to rehearsals, dancers must attend First Showings and Second Showings (two full run-throughs of the show) and Production Week. Production Week occurs the week before the show performances and involves several dress rehearsals.
        </p>
    
        <h3>Constitution</h3>
        <p>
          DanceTroupe abides by all MIT ASA policies. View our constitution <a className='link-name' href='http://web.mit.edu/dancetroupe/www/dt_constitution.pdf' target='_blank'>here.</a>
        </p>
      </div>
    );
  }
}

export default About;