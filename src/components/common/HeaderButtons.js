import React, {
  Component
} from 'react';
import {
  View, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

export default class HeaderButtons extends Component {
  render() {
    return (
      <View
        children={this.props.children}
        style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: Sizes.Width,
    padding: Sizes.InnerFrame,
    paddingTop: Sizes.OuterFrame,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});
