import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Platform, Modal, DatePickerIOS,
  DatePickerAndroid, TimePickerAndroid, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes, Lists
} from '../../Const';

// components
import Field from './Field';
import DateFormat from 'dateformat';

/**
 * Platform agnostic DatePicker wrapped inside InputField.
 *
 * @param {number} [delta] - delta of initial date and now
 * @param {Date} [minDate] - The minimum allowable Date.
 * @param {Date} [maxDate] - The maximum allowable Date.
 * @param {string} [type] - Either `time` or `date`.
 */
export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    let delta = this.props.delta || 0;
    let startDate = new Date();
    startDate.setDate(startDate.getDate()+delta);
    this.state = {
      date: startDate,
      tempDate: startDate,
      showModal: false
    };

    // bind methods
    this._renderIOS = this._renderIOS.bind(this);
    this.val = this.val.bind(this);
  }

  val() {
    return this.state.date;
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          if (Platform.OS === 'ios') {
            this.setState({showModal: true});
          } else {
            if (this.props.type === 'time'){
              TimePickerAndroid.open({

                // set forward 6 hours by default
                hour: (this.state.date.getHours() + 6) % 12,
                minute: this.state.date.getMinutes(),
                is24Hour: false
              }).then(result => {
                if (result.action !== TimePickerAndroid.dismissedAction) {
                  this.setState({
                    date: new Date(
                      0, 0, 0, result.hour, result.minute, 0, 0
                    )
                  });
                }
              })
            } else {
              DatePickerAndroid.open({
                date: this.state.date,
                minDate: this.props.minDate,
                maxDate: this.props.maxDate
              }).then(result => {
                if (result.action !== DatePickerAndroid.dismissedAction) {
                  this.setState({
                    date: new Date(result.year, result.month, result.day)
                  });
                }
              });
            }
          }
        }}>
        <Field {...this.props}>
          <View style={styles.textContainer}>
            {this._renderIOS()}
            <Text style={styles.text}>
              {
                this.props.type === 'time'
                ? (this.state.date.getHours() % 12 || 12)+ ':'
                + (this.state.date.getMinutes() > 9 ? '' : '0')
                + this.state.date.getMinutes()
                + (this.state.date.getHours() > 11 ? ' PM' : ' AM')
                : Lists.Days[new Date(this.state.date).getDay()]
                + ", " + DateFormat(this.state.date, 'mmmm dS yyyy')
              }
            </Text>
          </View>
        </Field>
      </TouchableOpacity>
    );
  }

  _renderIOS() {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          animationType="slide"
          onRequestClose={() => this.setState({
            showModal: false
          })}
          transparent
          visible={this.state.showModal}>
          <View style={styles.modalContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => this.setState({
                  showModal: false
                })}>
                <Text style={styles.button}>
                  {this.props.cancelLabel || 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({
                  date: this.state.tempDate,
                  showModal: false
                })}>
                <Text style={styles.button}>
                  {this.props.doneLabel || 'Done'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContainer}>
              <DatePickerIOS
                style={styles.datePickerIOS}
                date={this.state.tempDate}
                minimumDate={this.props.minDate}
                maximumDate={this.props.maxDate}
                mode={this.props.type || 'date'}
                onDateChange={date => this.setState({
                  tempDate: date
                })} />
            </View>
          </View>
        </Modal>
      )
    }
  }
}

let styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  },

  textContainer: {
    flex: 1
  },

  text: {
    textAlign: 'right',
    fontSize: Sizes.Text,
    color: Colors.Text,
    paddingRight: Sizes.OuterFrame
  },

  // modal for iOS
  modalContainer: {
    width: Sizes.Width,
    height: Sizes.Height,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  buttonContainer: {
    width: Sizes.Width,
    backgroundColor: Colors.ModalBackground,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: Sizes.InnerFrame,
    paddingRight: Sizes.InnerFrame,
    borderTopWidth: 2,
    borderColor: Colors.DarkOverlay,
    paddingTop: Sizes.InnerFrame
  },

  datePickerContainer: {
    width: Sizes.Width,
    backgroundColor: Colors.ModalBackground,
    alignItems: 'center',
    justifyContent: 'center'
  },

  datePickerIOS: {
    width: Sizes.Width
  },

  button: {
    color: Colors.Primary,
    paddingLeft: Sizes.InnerFrame / 2,
    paddingRight: Sizes.InnerFrame / 2
  }
});
