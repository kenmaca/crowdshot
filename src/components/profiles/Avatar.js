import React, {
  Component
} from 'react';
import {
  TouchableHighlight, StyleSheet, Image
} from 'react-native';
import {
  Colors
} from '../../Const';
import Database from '../../utils/Database';

// components
import Photo from '../common/Photo';

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
      photoId: null
    };

    this.ref = Database.ref(
      `profiles/${this.props.uid}/photo`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      data.exists()
      && this.setState({
          photoId: data.val()
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
        ]}
        onPress={this.props.onPress}
        underlayColor={Colors.Transparent}>
        <Photo
          style={[
            styles.avatar,
            this.props.style,
            this.props.size && {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2
            },
            this.props.color && {
              backgroundColor: this.props.color
            }
          ]}
          photoId={this.state.photoId} />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
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
    height: 20,
  }
});
