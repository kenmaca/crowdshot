import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

export default class OutlineText extends Component {
  render() {
    return (
      <View style={[
        styles.container,
        this.props.style
      ]}>
        <Text style={styles.text}>
          {this.props.text && this.props.text.toUpperCase()}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.Text,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Sizes.InnerFrame / 4,
    paddingBottom: Sizes.InnerFrame / 4,
    paddingLeft: Sizes.InnerFrame / 2,
    paddingRight: Sizes.InnerFrame / 2
  },

  text: {
    backgroundColor: Colors.Transparent,
    fontSize: Sizes.SmallText,
    fontWeight: '700',
    color: Colors.Text
  }
});
