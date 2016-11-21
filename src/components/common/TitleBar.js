import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

export default class TitleBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Sizes.InnerFrame,
    height: Sizes.NavHeight,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H3
  }
});
