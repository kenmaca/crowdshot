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
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: Sizes.InnerFrame,
    paddingTop: Sizes.InnerFrame * 4.5,
    minHeight: Sizes.NavHeight,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H1,
    fontWeight: '300'
  }
});
