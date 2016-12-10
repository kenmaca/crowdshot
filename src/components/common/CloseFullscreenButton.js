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
        {

          // only show if iOS or if this is a close
          // button (which is mandatory)
          (
            Platform.OS === 'ios'
            || !this.props.back
          ) && !this.props.hide && (
            <TouchableOpacity
              onPress={this.props.action || Actions.pop}>
              <Animatable.View
                animation='zoomIn'
                delay={250}
                duration={300}>
                <CircleIcon
                  icon={this.props.back ? 'arrow-back': 'close'}
                  color={Colors.Transparent}
                  checkColor={Colors.Text}
                  size={50} />
              </Animatable.View>
            </TouchableOpacity>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    padding: Sizes.InnerFrame / 2,
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
