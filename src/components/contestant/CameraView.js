import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Image, Alert, TouchableOpacity, Modal
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import Icon from 'react-native-vector-icons/MaterialIcons';

// components
import Camera from 'react-native-camera';
import CameraPreview from '../common/CameraPreview';

export default class CameraView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,
      flashMode: Camera.constants.FlashMode.auto //off or on or auto
    };
  }

  shutter() {
    if (!this.state.preview){
      this.camera.capture().then(data => {
        this.setState({
          preview: data.path
        });
      });
    }
  }

  toggleFlash() {
    const { flashMode} = this.state;
    switch (flashMode) {
      case Camera.constants.FlashMode.off:
        this.setState({
          flashMode: Camera.constants.FlashMode.on
        });
        break;
      case Camera.constants.FlashMode.on:
        this.setState({
          flashMode: Camera.constants.FlashMode.auto
        });
        break;
      default:
        this.setState({
          flashMode: Camera.constants.FlashMode.off
        });
    }
  }

  handleFocusChanged(){

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
          captureAudio={false}
          captureMode={Camera.constants.CaptureMode.still}
          captureTarget={Camera.constants.CaptureTarget.temp}
          aspect={Camera.constants.Aspect.fill}
          type={Camera.constants.Type.back}
          defaultOnFocusComponent={true}
          flashMode={this.state.flashMode}
          onFocusChanged={() => this.handleFocusChanged}>

        </Camera>
        <View style={styles.lowerContainer}>
          <TouchableOpacity
            onPress={() => this.toggleFlash()}>
            <Icon
              size={40}
              name={
                this.state.flashMode == Camera.constants.FlashMode.off
                  ? 'flash-off'
                : this.state.flashMode == Camera.constants.FlashMode.on
                  ? 'flash-on'
                : 'flash-auto'}
              color={Colors.Text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.shutter()}>
            <View style={styles.shutter}/>
          </TouchableOpacity>
          <View style={styles.placeHolder}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.Primary
  },

  camera: {
    flex: 1,
    alignSelf: 'flex-start',
    width: Sizes.Width,
    height: Sizes.Width*4/3,
    justifyContent: 'flex-end',
    padding: Sizes.OuterFrame,
  },

  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  lowerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.OuterFrame,
    backgroundColor: 'black',
  },

  shutter: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    backgroundColor: Colors.Transparent,
    borderColor: Colors.Text,
    borderWidth: 4,
    margin: Sizes.OuterFrame
  },

  placeHolder: {
    height: 40,
    width: 40
  }
});
