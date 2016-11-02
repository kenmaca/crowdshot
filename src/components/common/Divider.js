import React, {
  Component
} from 'react';
import {
  StyleSheet, View
} from 'react-native';
import {
  Colors
} from '../../Const';

/**
 * A divider that expands full width.
 */
export default class Divider extends Component {
  render() {
    return (
      <View
        style={[
          styles.divider,
          this.props.style,
          this.props.color && {backgroundColor: this.props.color},
        ]} />
    );
  }
}

styles = StyleSheet.create({
  divider: {
    alignSelf: 'stretch',
    backgroundColor: Colors.Divider,
    height: 0.6
  }
});
