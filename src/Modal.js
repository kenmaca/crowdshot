import React, {
  Component
} from 'react';
import {
  View, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from './Const';

export default class Modal extends Component {

  render() {
    return (
      <View style={styles.container}>
        {this.props.view}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
