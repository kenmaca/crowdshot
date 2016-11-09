import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Field from '../../components/common/Field';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CameraView from '../../components/contestant/CameraView';

export default class Capture extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <TouchableOpacity
            onPress={() => Actions.modal({
            view: <CameraView />
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
