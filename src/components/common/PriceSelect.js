import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableHighlight, Alert, TouchableOpacity
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

export default class PriceSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: (
        this.props.options ? this.props.options[0]: 0
      ),
      version: 0
    };
  }

  loopVersion() {
    var i = this.state.version;
    if (i == 0) {
      return 1
    } else if (i == 1) {
      return 2
    } else if (i == 2){
      return 0
    }
  }

  render() {
    return (
      <Field
        {...this.props}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            {
              (
                this.props.options[this.state.version]
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
            <TouchableOpacity
              onPress={() => this.setState({
                version: this.loopVersion()
              })}>
              <CircleIcon
                style={styles.arrow}
                size={18}
                color={Colors.ModalBackground}
                checkColor={Colors.AlternateText}
                icon='chevron-right' />
            </TouchableOpacity>
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
