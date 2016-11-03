import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Field from './Field';

/**
 * Creates a line of Information wrapped in a InputField.
 *
 * @param {string} props.info - The information.
 */
export default class InformationField extends Component {
  render() {
    return (
      <Field
        {...this.props}
        field={
          <Text style={[
            styles.info,
            this.props.style
          ]}>
            {this.props.info}
          </Text>
        } />
    );
  }
}

const styles = StyleSheet.create({
  info: {
    flex: 1,
    alignSelf: 'flex-end',
    textAlign: 'right',
    paddingRight: Sizes.OuterFrame,
    fontSize: Sizes.Text,
    color: Colors.Text
  }
});
