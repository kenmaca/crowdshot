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
          size={70} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: Sizes.InnerFrame,
    right: 0,
    position: 'absolute'
  }
});
