import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

export default class ProgressBlocker extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.modal}>
          <ActivityIndicator />
          <Text style={styles.message}>
            {this.props.message}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Overlay
  },

  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.OuterFrame,
    width: Sizes.Width * 0.8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.ModalBackground
  },

  message: {
    marginTop: Sizes.InnerFrame,
    fontSize: Sizes.H4
  }
});
