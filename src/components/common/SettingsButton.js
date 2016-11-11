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

export default class SettingsButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={Actions.settings}>
        <CircleIcon
          icon='settings'
          color={Colors.Transparent}
          checkColor={Colors.Text}
          shadowStyle={styles.shadow}
          size={40} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: Sizes.OuterFrame,
    right: Sizes.InnerFrame / 2,
    position: 'absolute'
  },

  shadow: {
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});
