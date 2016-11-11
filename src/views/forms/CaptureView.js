import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Image, Alert, TouchableOpacity, Modal
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import Camera from 'react-native-camera';
import CameraPreview from '../../components/common/CameraPreview';

export default class CaptureView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: null
    };

    this.shutter = this.shutter.bind(this);
  }

  shutter() {
    this.camera.capture().then(data => {
      this.setState({
        preview: data.path
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent
          animationType='slide'
          visible={!!this.state.preview}>
          <CameraPreview
            cancel={() => {
              this.setState({
                preview: null
              });
            }}
            accept={photoId => {

              // and close the modal
              this.setState({
                preview: null
              });

              // parent callback
              this.props.onUploaded
              && this.props.onUploaded(photoId);
            }}
            path={this.state.preview} />
        </Modal>
        <Camera
          ref={cam => this.camera = cam}
          style={styles.camera}
          captureTarget={Camera.constants.CaptureTarget.temp}
          aspect={Camera.constants.Aspect.fill}>
          <View style={styles.upperContainer}></View>
          <View style={styles.lowerContainer}>
            <TouchableOpacity
              onPress={this.shutter}>
              <Image
                style={styles.shutter}
                source={require('../../../res/img/shutter.png')} />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 50,
  },

  camera: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    padding: Sizes.InnerFrame,
  },

  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  lowerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  shutter: {
    height: 60,
    width: 60
  }
});
