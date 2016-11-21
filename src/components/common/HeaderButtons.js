import React, {
  Component
} from 'react';
import {
  View, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import LinearGradient from 'react-native-linear-gradient';

export default class HeaderButtons extends Component {
  render() {
    return (
      <LinearGradient
        {...this.props}
        colors={[
          Colors.MediumDarkOverlay,
          Colors.Transparent,
          Colors.Transparent
        ]}
        style={[
          styles.container,
          this.props.style
        ]}>
        <View
          children={this.props.children}
          style={styles.buttonContainer} />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: Sizes.Width,
    minHeight: Sizes.Height * 0.2,
    padding: Sizes.InnerFrame,
    paddingTop: Sizes.OuterFrame,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});