import React, {
  Component
} from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import Avatar from './Avatar';

/**
 * Displays a circlar avatar.
 */
export default class GroupAvatar extends Component {

  /**
   * Creates a new Group of Avatars.
   *
   * @param {string} props.uids[] - A listing of UIDs to show.
   * @param {object} props.style - The style to override with.
   * @param {string} props.color - The color for empty Avatars.
   * @param {number} props.limit - Avatars to show before collapsing.
   */
  constructor(props) {
    super(props);
    this.state = {
      visible: [],
      collapsed: []
    };
  }

  componentWillReceiveProps(nextProps) {
    nextProps.uids
    && nextProps.uids.length > 0
    && this.setState({
      visible: nextProps.uids.slice(
        0,
        nextProps.limit || nextProps.uids.length
      ),
      collapsed: nextProps.uids.slice(
        nextProps.limit || nextProps.uids.length,
        nextProps.uids.length
      )
    });
  }

  // TODO: implement tappable collapsed icon to show modal of
  // all collapsed users
  render() {
    return (
      <View style={[
        styles.container,
        this.props.style,
        this.props.size && {
          marginRight: this.props.size / 8
        }
      ]}>
        {
          this.state.visible.map(uid => (
            <View
              style={[
                styles.outline,
                this.props.size && {
                  height: this.props.size,
                  width: this.props.size,
                  borderRadius: this.props.size / 2,
                  marginRight: this.props.size / 8 * -1
                }
              ]}
              key={`${uid}-${Math.random()}`}>
              <Avatar
                outline
                onPress={() => Actions.profile({uid: uid})}
                color={this.props.color || Colors.Primary}
                size={this.props.size || 40}
                uid={uid} />
            </View>
          ))
        }
        {
          this.state.collapsed.length > 0 && (
            <View style={[
              styles.outline,
              this.props.size && {
                height: this.props.size,
                width: this.props.size,
                borderRadius: this.props.size / 2,
                marginRight: this.props.size / 8 * -1
              }
            ]}>
              <View style={[
                styles.collapsedContainer,
                {
                  backgroundColor: this.props.color || Colors.Primary
                },
                this.props.size && {
                  width: this.props.size - (this.props.size * 0.1),
                  height: this.props.size - (this.props.size * 0.1),
                  borderRadius: (this.props.size - (this.props.size * 0.1)) / 2
                }
              ]}>
                <Text style={styles.collapsed}>
                  +{
                    this.state.collapsed.length < 1000
                    ? this.state.collapsed.length
                    : 'lots'
                  }
                </Text>
              </View>
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 5
  },

  outline: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    marginRight: -5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Outline
  },

  collapsedContainer: {
    height: 36,
    width: 36,
    borderRadius: 36 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },

  collapsed: {
    color: Colors.Text,
    fontSize: Sizes.SmallText,
    fontWeight: '600'
  }
});
