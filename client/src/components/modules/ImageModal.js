import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Message, Button, Modal, Header,
} from 'semantic-ui-react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './modules.css';

class ImageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validateErr: '',
      imageSelected: false,
      modalOpen: false,
      src: null,
    };
  }

  static propTypes = {
    handleImageCrop: PropTypes.func,
  }

  static defaultProps = {
  }

  onChange = (e) => {
    e.preventDefault();
    this.setState({ validateErr: '' });
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if (files[0].size > 1024 * 1024 * 25) {
      this.setState({
        src: null,
        imageSelected: false,
        validateErr: 'File size cannot be larger than 25 MB.',
      });
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);
    this.setState({ imageSelected: true });
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.setState({
      modalOpen: false,
      imageSelected: false,
    });
  }

  cropImage = () => {
    const { handleImageCrop } = this.props;
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    handleImageCrop(this.cropper.getCroppedCanvas().toDataURL());
    this.handleClose();
  }

  render() {
    const {
      validateErr,
      imageSelected,
      modalOpen,
      src,
    } = this.state;

    let content;
    if (imageSelected) {
      content = (
        <Grid centered>
          <Grid.Row>
            <Cropper
              ref="cropper"
              src={src}
              style={{ height: 300, width: 400 }}
            // Cropper.js options
              aspectRatio={1 / 1}
              guides={false}
              zoomable={false}
              zoomOnTouch={false}
              zoomOnWheel={false}
              viewMode={1}
              ref={(cropper) => { this.cropper = cropper; }}
            />
          </Grid.Row>
          <Grid.Row>
            <div>
              <Button color="green" floated="right" onClick={this.cropImage}>Save</Button>
              <Button floated="right" onClick={this.handleClose}>Cancel</Button>
            </div>
          </Grid.Row>
        </Grid>
      );
    } else {
      content = <div />;
    }

    return (
      <Modal
        trigger={<Button onClick={this.handleOpen}>Select New Photo</Button>}
        open={modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Select Photo</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <input type="file" name="imageData" accept="image/*" onChange={this.onChange} style={{ paddingBottom: '1.5rem' }} />
            {content}
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ImageModal;
