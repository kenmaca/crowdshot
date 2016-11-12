import React, {
  Component
} from 'react';
import {
  StyleSheet, TextInput
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import Field from './Field';

/**
 * Displays a Input box for text entry.
 */
export default class SingleLineInput extends Component {

  /**
   * Creates a new Input box for text entry.
   */
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    // bind methods
    this.val = this.val.bind(this);
  }

  val() {
    return this.state.value;
  }

  render() {
    return (
      <Field
        {...this.props}>
        <TextInput
          placeholderTextColor={Colors.SubduedText}
          {...this.props}
          clearButtonMode='always'
          onChangeText={text => {
            text = (
              !!this.props.onChangeText ?
              this.props.onChangeText(text) || text:
              text
            );
            this.setState({
              value: text
            });
          }}
          style={styles.input} />
      </Field>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    color: Colors.Text,
    fontSize: Sizes.Text,
    textAlign: 'right',
    flex: 1,
  }
});
