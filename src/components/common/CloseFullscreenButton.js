import React, {
  Component
} from 'react';
import {
  StyleSheet, TouchableOpacity
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import CircleIcon from './CircleIcon';

export default class CloseFullscreenButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={Actions.pop}>
        <CircleIcon
          icon='close'
          color={Colors.Transparent}
          checkColor={Colors.Text}
          shadowStyle={styles.shadow}
          size={50} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: Sizes.InnerFrame,
    left: 0,
    position: 'absolute'
  },

  shadow: {
    shadowColor: Colors.DarkOverlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});
