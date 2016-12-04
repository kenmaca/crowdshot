import React, {
  Component
} from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import CircleIcon from './CircleIcon';

export default class HeaderButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={this.props.style}>
        <CircleIcon
          fontAwesome={this.props.fontAwesome}
          shadowStyle={styles.shadowStyle}
          style={styles.container}
          color={Colors.Transparent}
          size={36}
          icon={this.props.icon} />
        {
          this.props.unread > 0
          && (
            <View style={styles.unreadContainer}>
              <Text style={styles.unread}>
                {this.props.unread}
              </Text>
            </View>
          )
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: Sizes.InnerFrame,
  },

  shadowStyle: {
    textShadowColor: Colors.Overlay,
    textShadowOffset: {width: 2, height: 1},
    textShadowRadius: 10
  },

  unreadContainer: {
    position: 'absolute',
    top: 20,
    left: Sizes.InnerFrame * 2.5,
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: Sizes.InnerFrame / 4,
    paddingTop: Sizes.InnerFrame / 6,
    paddingBottom: Sizes.InnerFrame / 6,
    borderRadius: 20,
    backgroundColor: Colors.Cancel
  },

  unread: {
    fontSize: Sizes.SmallText,
    color: Colors.Text
  }
});
