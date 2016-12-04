import React, {
  Component
} from 'react';
import {
  StyleSheet, TouchableOpacity
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import CircleIcon from './CircleIcon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

export default class CloseFullscreenButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.action || Actions.pop}>
        <Animatable.View
          animation='zoomIn'
          delay={250}
          duration={300}>
          <Icon
            style={styles.icon}
            name='close'
            color={Colors.Text}
            size={28} />
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    padding: Sizes.InnerFrame,
    position: 'absolute'
  },

  icon: {
    backgroundColor: Colors.Transparent
  }
});
