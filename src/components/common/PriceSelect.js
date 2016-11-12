import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableHighlight
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import Field from './Field';
import Button from './Button';

export default class PriceSelect extends Component {
  render() {
    return (
      <Field
        {...this.props}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button
              color={Colors.Primary}
              fontColor={Colors.Text}
              container={styles.button}
              isDisabled
              label='$0'/>
            <Button
              color={Colors.Primary}
              container={styles.button}
              label='$1'/>
            <Button
              color={Colors.Primary}
              container={styles.button}
              label='$5'/>
            <Button
              color={Colors.Primary}
              container={styles.button}
              label='$10'/>
            <Button
              color={Colors.Primary}
              container={styles.button}
              label='...'/>
          </View>
        </View>
      </Field>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  
  button: {
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
})
