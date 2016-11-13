import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableHighlight, Alert
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import Field from './Field';
import Button from './Button';

export default class PriceSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: (
        this.props.options ? this.props.options[0]: 0
      )
    };
  }

  render() {
    return (
      <Field
        {...this.props}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            {
              (
                this.props.options
                || [0, 1, 5, 10]
              ).map((value, i) => (
                <Button
                  key={i}
                  onPress={() => {
                    this.setState({
                      selected: value
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
                    this.state.selected === value
                    ? Colors.Primary
                    : Colors.Disabled
                  }
                  container={styles.button}
                  label={`$${value}`} />
              ))
            }
            <Button
              onPress={() => Alert.alert('Not implemented')}
              color={Colors.Disabled}
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
