import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";
import { photos } from './CpwPhotos';
import '../static.css';

class Cpw extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentImage: 0,
      viewerIsOpen: false,
    }
  }

  openLightbox = (e, { _photo, index }) => {
    this.setState({
      currentImage: index,
      viewerIsOpen: true
    })
  }

  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      viewerIsOpen: false
    })
  }

  componentDidMount() {
    document.title = 'CP*';
  }

  render() {
    const {
      currentImage,
      viewerIsOpen
    } = this.state;
    return (
      <div className='static-page' id='cpw'>
        <h1>CP* 2020</h1>
        <p>While not being in person has filled us with <b><i>woah</i></b>,
          <br></br>
        Come meet the community we’ve all come to know.
        <br></br>
        We can’t wait to meet all of you <b><i>folks</i></b>,
        <br></br>
        And give you a <b><i>dab</i></b> of DT—the dance, fun, and jokes.
        <br>
          </br>
            -Matt Tung 2020</p>
        <p><a className='link-name' href='https://mit.zoom.us/j/97207697629'>Zoom</a> with us on Sunday, April 19th from 1-3PM ET to learn more about DT! Check for an email from ASA with the password to enter the call.</p>
        <Gallery direction='column' photos={photos} onClick={this.openLightbox} />
        <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={this.closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={photos.map(x => ({
                  ...x,
                  srcset: x.srcSet,
                  caption: x.caption
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </div>
    );
  }
}

export default Cpw;