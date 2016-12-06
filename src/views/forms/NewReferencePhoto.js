import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import CameraView from '../../components/common/CameraView';

export default class NewReferencePhoto extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title={
          this.props.title || 'Take a Photo of the Subject'
        } />
        <View style={styles.content}>
          <CameraView
            onUploaded={photoId => {

              // out
              Actions.pop();

              // outer callback
              this.props.onTaken && this.props.onTaken(
                photoId
              );
            }} />
        </View>
        <CloseFullscreenButton back />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  content: {
    flex: 1
  }
});
