import React, {
  Component
} from 'react';
import {
  View, StyleSheet, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import CircleIcon from './CircleIcon';

export default class HeaderButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}>
        <CircleIcon
          fontAwesome
          style={styles.container}
          color={Colors.Transparent}
          size={36}
          icon={this.props.icon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: Sizes.InnerFrame / 2
  }
});
