import React, {
  Component
} from 'react';
import {
  TouchableHighlight, StyleSheet, Image, View, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Database from '../../utils/Database';

// components
import Photo from '../common/Photo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Rank from '../profiles/Rank';

/**
 * Displays a circlar avatar.
 */
export default class Avatar extends Component {

  /**
   * Creates a new Avatar.
   *
   * @param {string} props.uid - The UID of the Profile for this Avatar.
   * @param {object} props.style - The style to override with.
   * @param {string} props.color - The color for the empty Avatar.
   * @param {number} props.size - The size.
   */
  constructor(props) {
    super(props);
    this.state = {
      photo: null
    };

    this.ref = Database.ref(
      `profiles/${this.props.uid}`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      data.exists()
      && this.setState({
        ...data.val()
      });
    });
  }

  componentWillUnmount() {
    this.ref.off('value', this.listener);
  }

  render() {
    let innerSize = (
      this.props.outline
      ? (this.props.size || 20) - (this.props.size * 0.1)
      : (this.props.size || 20)
    );

    return (
      <TouchableHighlight
        style={styles.touchable}
        onPress={this.props.onPress}
        underlayColor={Colors.Transparent}>
        <View style={styles.touchable}>
          <View
            style={[
              styles.container,
              this.props.size && {
                width: this.props.size,
                height: this.props.size,
                borderRadius: this.props.size / 2
              },
              this.props.outlineColor && {
                backgroundColor: this.props.outlineColor
              }
            ]}>
            <Photo
              style={[
                styles.avatar,
                this.props.style,
                this.props.size && {
                  width: innerSize,
                  height: innerSize,
                  borderRadius: innerSize / 2
                }
              ]}
              photoId={this.state.photo} />
          </View>
          {
            this.props.showRank && (
              <Rank
                onlyLast
                contestsWon={this.state.countWon}
                size={this.props.size / 5}
                style={[
                  styles.rank,
                  this.props.size && {
                    bottom: this.props.size / 20,
                    right: this.props.size / 20
                  }
                ]} />
            )
          }
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: Colors.Transparent
  },

  container: {
    backgroundColor: Colors.Outline,
    borderRadius: 10,
    width: 20,
    height: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },

  avatar: {
    backgroundColor: Colors.Transparent,
    borderRadius: 10,
    width: 20,
    height: 20
  },

  rank: {
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});
