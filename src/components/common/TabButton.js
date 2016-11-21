import React, {
  Component,
} from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class TabButton extends Component {
  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <View>
          <Icon
            name={this.props.iconName}
            size={Sizes.H3}
            color={
              this.props.selected ? Colors.Primary: Colors.Text
            } />
          {
            this.props.unread > 0 && (
              <View style={styles.unreadContainer}>
                <Text style={styles.unread}>
                  {this.props.unread}
                </Text>
              </View>
            )
          }
        </View>
        <Text
          style={{
            fontSize: Sizes.SmallText,
            color: this.props.selected ? Colors.Primary: Colors.Text
          }}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  unreadContainer: {
    position: 'absolute',
    top: -5,
    right: -10,
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
