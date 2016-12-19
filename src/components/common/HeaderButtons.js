import React, {
  Component, Children
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
      <View style={styles.container}>
        {
          Children.map(this.props.children, child => (
            <View
              key={Math.random()}
              style={styles.shadow}>
              {child}
            </View>
          ))
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: Sizes.Width,
    padding: Sizes.InnerFrame,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  shadow: {
    backgroundColor: Colors.Transparent,
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
});
