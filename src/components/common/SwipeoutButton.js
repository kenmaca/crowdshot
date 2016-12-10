import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

export default class SwipeoutButton extends Component {
  render() {
    return (
      <View style={[
        styles.container,
        this.props.color && {
          backgroundColor: this.props.color
        },
        this.props.style
      ]}>
        <Text style={styles.text}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Transparent
  },

  text: {
    fontSize: Sizes.Text,
    color: Colors.Text
  }
});
