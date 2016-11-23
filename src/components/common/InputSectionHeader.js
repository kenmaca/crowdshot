import React, {
  Component
} from 'react';
import {
  View, StyleSheet, TextInput, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

/**
 * Displays a section header for SingleLineInput fields.
 *
 * @param {string} label - The label for this InputSectionHeader.
 * @param {string} [color] - The font color.
 */
export default class InputSectionHeader extends Component {
  render() {
    return (
      <View style={[
        styles.container,
        this.props.backgroundColor && {
          backgroundColor: this.props.backgroundColor
        },
        this.props.style
      ]}>
        <Text style={[
          styles.label,
          this.props.color && {color: this.props.color},
          this.props.offset !== null && {paddingLeft: this.props.offset}
        ]}>
          {this.props.label.toUpperCase()}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 5
  },

  label: {
    backgroundColor: Colors.Transparent,
    color: Colors.SubduedText,
    fontSize: Sizes.SmallText
  }
});
