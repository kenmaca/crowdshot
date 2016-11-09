import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import Field from '../../components/common/Field';
import CaptureView from './CaptureView';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Capture extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <TouchableOpacity
            onPress={() => Actions.modal({
            view: <CaptureView />
            })} >
            <Icon
              name='camera-alt'
              size={38}
              color={Colors.Secondary}/>
          </TouchableOpacity>
          <Text style={styles.text}>
            Capture Here!
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: Sizes.Text - 2,
    color: Colors.Text,
    textAlign: 'center'
  },
  cameraContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.InnerFrame
  }
});
