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
    document.title = 'CPW';
  }

  render() {
    const {
      currentImage,
      viewerIsOpen
    } = this.state;
    return (
      <div className='static-page' id='cpw'>
        <h1>CPW 2020</h1>
        <p>MIT DanceTroupe is one of the largest dance organizations at MIT. We are a student-run group dedicated to bringing a variety of dance styles 💃 Auditions happen the first week of each semester, and we perform 5 shows at the end of each semester. No experience is required, we accept dancers of all levels! Come learn to dance and join our family!</p>
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