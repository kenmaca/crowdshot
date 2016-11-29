import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Picker, Alert, TouchableOpacity, Modal
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import Field from './Field';
import Button from './Button';
import CircleIcon from './CircleIcon';
import PriceSelectPicker from './PriceSelectPicker';

export default class PriceSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: (
        this.props.options ? this.props.options[0]: 0
      ),
      button: true
    };
  }

  render() {
    return (
      <Field
        {...this.props}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            {
              (this.props.options ||
                [0, 1, 5, 10]
              ).map((value, i) => (
                <Button
                  key={i}
                  onPress={() => {
                    this.setState({
                      options: value,
                      button: true
                    });

                    // outer callback
                    (
                      this.props.onSelected
                      && this.props.onSelected(
                        value
                      )
                    );
                  }}
                  color={
                    (this.state.button && this.state.options === value)
                    ? Colors.Primary
                    : Colors.Disabled
                  }
                  container={styles.button}
                  label={`$${value}`} />
              ))
            }
            <View
              style={
                (this.state.button)
                ? [styles.button, {backgroundColor: Colors.Disabled}]
                : [styles.button, {backgroundColor: Colors.Primary}]}>
              <PriceSelectPicker
                onSelected={amount => this.props.onSelected(amount)}
                onButtonPress={change => this.setState({
                  button: change
                })}>
              </PriceSelectPicker>
            </View>
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
    alignItems: 'center',
    paddingRight: 5
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
