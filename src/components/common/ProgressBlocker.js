import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Animatable from 'react-native-animatable';

export default class ProgressBlocker extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Animatable.View
          animation='bounceIn'
          duration={500}
          delay={250}
          style={styles.modal}>
          <ActivityIndicator />
          <Text style={styles.message}>
            {this.props.message}
          </Text>
        </Animatable.View>
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
