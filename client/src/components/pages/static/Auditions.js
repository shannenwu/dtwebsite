import React, { Component } from 'react';
import './static.css';

class Auditions extends Component {
  componentDidMount() {
    document.title = 'Auditions';
  }

  render() {
    return (
      <div className='static-page'>
        <h1>Auditions</h1>
        <p>
          DanceTroupe auditions are divided between a Saturday and Sunday at the beginning of each term. For Fall 2019, they will be held on September 7th and 8th in the BC Porter Room. You can find the FB event <a className='link-name' href='https://www.facebook.com/events/229532211302259/?event_time_id=229532214635592' target='_blank'>here.</a> Auditions are a laid-back, fun process, so nothing should stop you from auditioning!
        </p>
        <h3>Saturday</h3>
        <p>
          On Saturday, choreographer showcases are held. Each of the choreographers will demonstrate a snippet of their dance, talk about their music choices and the type of dancers they are looking for. This process gives prospective dancers a chance to watch all the dances for the term and decide which to audition for. 
        </p>
        <p>
          After showcases, each dancer must fill out an online preference sheet. Each sheet will contain a ranking of the desired dances, the number of desired dances, as well as weekly conflicts. The preference sheet MUST be submitted by midnight on Saturday.
        </p>
    
        <h3>Sunday</h3>
        <p>
          On Sunday, the full audition process begins. Each dancer is assigned an audition number corresponding to his/her preference sheet. Dancers auditioning for contemporary should participate in the contemporary auditions from 11 - 1pm. Those auditioning for urban should participate in the urban auditions from 2 - 4pm. You are welcome to come learn both pieces, and any dancers who have preffed both styles should participate in both.
        </p>
        
        <h3>Audition Process</h3>
        <p>
          For each audition, dancers will be taught a short piece. After teaching (about 30 - 40 minutes), dancers will perform the audition piece in groups of 10 - 15 for all of the choreographers.
        </p>
        <p>
          After all auditions are complete, the choreographers will select their dancers and create a weekly rehearsal schedule. We attempt to incorporate as many dancer conflicts as possible. Results are announced later that evening and practices begin immediately on Monday!
        </p>
        <p>
          If you have any questions, please email <a className='link-name' href='mailto:dt-officers@mit.edu' target='_blank'>dt-officers@mit.edu.</a> Remember, this is a fun process, so do not worry about how well you perform! Choreographers are mostly looking for potential and dancing ability, not your ability to perfectly perform the audition piece, so just try to show off what you have, rather than worrying about hitting every move precisely.
        </p>
    
        <h2>Audition Policies</h2>
        <h3>Please read this entire section before emailing officers or choreographers!</h3>
        <p>
          Every semester, we have over 300 people attending our showcase and auditions. We understand that people may have conflicts, but we are unable to offer makeups for missed auditions. We appreciate your understanding in this manner.
        </p>
        <p>
          The showcase is a mandatory event for the benefit of dancers auditioning. While we do film the showcase and make the videos available online, you should make a reasonable effort to attend the showcase. If you are unable to attend, you may still audition as long as you submit a preference sheet by the deadline.
        </p>
        <p>
          All preference sheets must be submitted through the DanceTroupe website by midnight after the showcase. Do not email your preferences to the officers or choreographers. Unfortunately, we are unable to accommodate late submissions, and you may not audition without submitting a preference sheet.
        </p>
      </div>
    );
  }
}

export default Auditions;
