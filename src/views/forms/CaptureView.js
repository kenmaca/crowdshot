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

export default class CaptureView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.captureContainer}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.Background
  },
  captureContainer: {

  },
  text: {
    fontSize: Sizes.Text,
    color: Colors.Text,
    textAlign: 'center'
  }
});
