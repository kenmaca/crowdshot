import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Picker, Alert, TouchableOpacity
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

    this.options = this.props.options || [0, 1, 5, 10];
    this.state = {
      selected: this.options[0]
    };

    this.select = this.select.bind(this);
  }

  select(value) {
    this.setState({
      selected: value
    });

    // outer callback
    (this.props.onSelected
      && this.props.onSelected(
        value
      )
    );
  }

  render() {
    return (
      <Field
        {...this.props}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            {
              this.options.map(value => (
                <Button
                  key={Math.random()}
                  onPress={() => this.select(value)}
                  color={
                    this.state.selected === value
                    ? Colors.Primary
                    : Colors.Disabled
                  }
                  container={styles.button}
                  label={`$${value}`} />
              ))
            }
            <PriceSelectPicker
              highlighted={
                this.options.indexOf(this.state.selected) < 0
              }
              onSelected={this.select} />
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
    padding: 5,
    borderRadius: 17,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
})
