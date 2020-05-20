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
    document.title = 'Gallery';
  }

  render() {
    const {
      currentImage,
      viewerIsOpen
    } = this.state;
    return (
      <div className='static-page' id='cpw'>
        <h1>Gallery</h1>
        <p>While not being in person has filled us with <b><i>woah</i></b>,
        <br />
        Come meet the community we’ve all come to know.
        <br />
        We can’t wait to meet all of you <b><i>folks</i></b>,
        <br />
        And give you a <b><i>dab</i></b> of DT—the dance, fun, and jokes.
        <br />
            -Matt Tung 2020
        </p>
        <video width="500" height="290" controls="controls">
          <source src="https://www.dropbox.com/s/vgnqj9e3glkbeqn/DT%20CP%2A%20Pub%20final.mov?raw=1" type="video/mp4" />
        </video>
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