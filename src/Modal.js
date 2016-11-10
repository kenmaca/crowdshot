import React, {
  Component
} from 'react';
import {
  View, StyleSheet, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from './Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import Icon from 'react-native-vector-icons/MaterialIcons';
import CloseFullscreenButton from './components/common/CloseFullscreenButton';

export default class Modal extends Component {

  render() {
    return (
      <View style={styles.container}>
        {this.props.view}
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Sizes.Height + 50,
    width: Sizes.Width
  }
});
