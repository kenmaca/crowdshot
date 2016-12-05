import React, {
  Component
} from 'react';
import {
  StyleSheet, TouchableOpacity, Platform, View
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import CircleIcon from './CircleIcon';
import * as Animatable from 'react-native-animatable';

export default class CloseFullscreenButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        { Platform.OS === 'ios' ?
        <TouchableOpacity
          onPress={this.props.action || Actions.pop}>
          <Animatable.View
            animation='zoomIn'
            delay={250}
            duration={300}>
            <CircleIcon
              icon='close'
              color={Colors.Transparent}
              checkColor={Colors.Text}
              shadowStyle={styles.shadow}
              size={50} />
          </Animatable.View>
        </TouchableOpacity>
        : <View/> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: Sizes.InnerFrame/2,
    left: 0,
    position: 'absolute'
  },

  shadow: {
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});
