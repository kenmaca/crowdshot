import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Camera from 'react-native-camera';
import CameraView from '../../components/contestant/CameraView';

export default class CaptureView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <CameraView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: Sizes.Text,
    color: Colors.Text,
    textAlign: 'center'
  }
});
