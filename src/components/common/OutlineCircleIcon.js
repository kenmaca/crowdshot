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
import CircleIcon from './CircleIcon';

export default class OutlineCircleIcon extends Component {
  render() {
    return (
      <View style={[
        styles.outline,
        this.props.size && {
          width: this.props.size,
          height: this.props.size,
          borderRadius: this.props.size / 2
        },
        this.props.checkColor && {
          backgroundColor: this.props.checkColor
        },
        this.props.style
      ]}>
        <CircleIcon
          {...this.props}
          size={(this.props.size || 20) - 2} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.Text,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
