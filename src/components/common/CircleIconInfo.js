import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import CircleIcon from './CircleIcon';

export default class CircleIconInfo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <CircleIcon
          size={this.props.size}
          icon={this.props.icon}
          checkColor={this.props.checkColor}
          color={this.props.color} />
        <Text style={styles.text}>
          {this.props.label}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.InnerFrame / 2,
    marginTop: Sizes.InnerFrame / 2
  },

  text: {
    marginLeft: Sizes.InnerFrame,
    fontSize: Sizes.Text
  }
});
