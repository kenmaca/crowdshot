import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Picker, Modal, TouchableOpacity, Text,
  TouchableWithoutFeedback, Alert
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const'

// components
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class PriceSelectPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }

    // from 20 to 990
    this.options = new Array(98).fill(0).map(
      (v, i) => (i + 2) * 10
    );

    // methods
    this.select = this.select.bind(this);
  }

  select(value, close) {
    close && this.props.onSelected && this.props.onSelected(value);
    this.setState({
      selected: value,
      visible: !close
    });
  }

  render() {
    return(
      <View >
        <Modal
          transparent
          visible={this.state.visible}
          animationType='fade'>
          <TouchableOpacity
            onPress={() => this.select(
              this.state.selected || this.options[0],
              true
            )}
            style={styles.modal}>
            <TouchableWithoutFeedback>
              <Animatable.View
                animation='slideInUp'
                duration={150}
                style={styles.pickerContainer}>
                <Picker
                  selectedValue={this.state.selected}
                  onValueChange={value => this.select(value)}
                  style={styles.picker}>
                  {
                    this.options.map(value => (
                      <Picker.Item
                        key={Math.random()}
                        label={`$${value}`}
                        value={value} />
                    ))
                  }
                </Picker>
              </Animatable.View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity
          onPress={() => this.setState({
            visible: true
          })}>
          <View
            style={[
              styles.pickerButton,
              {
                backgroundColor: (
                  this.props.highlighted
                  ? Colors.Primary: Colors.Disabled
                )
              }
            ]}>
            {
              this.state.selected
              ? (
                <Text style={styles.text}>
                  {`$${this.state.selected}`}
                </Text>
              ): (
                <Icon
                  color={Colors.Text}
                  name='more-horiz'
                  size={24} />
              )
            }
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: Sizes.Text,
    color: Colors.Text
  },

  pickerButton: {
    padding: 5,
    borderRadius: 21,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },

  modal: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: Colors.DarkOverlay
  },

  pickerContainer: {
    alignSelf: 'stretch',
    minHeight: 150,
    backgroundColor: Colors.ModalBackground
  }
});
