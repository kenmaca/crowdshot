import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Picker, TouchableOpacity, Modal, TouchableHighlight, Text
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const'

export default class PriceSelectPicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: '40',
      number: [],
      showModal: false
    }
  }

  componentDidMount() {


    const priceList = [];
    for (i=10;i<101;i++) {
      priceList.push(i + "");
    }
    this.setState({
      number: priceList
    })
  }

  onValueChange(key, value) {
    
    const state = {}
    state[key] = value
    this.setState(state)
  }


  render() {
    return(
      <View >
        <Modal
          animationType="slide"
          onRequestClose={() => this.setState({
            showModal: false
          })}
          transparent={true}
          visible={this.state.showModal}>
          <View style={styles.modal}>
            <View style={styles.close}>
              <TouchableHighlight onPress={() => this.setState({
                showModal: false
              })}>
                <Text>Close</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => {this.setState({
                showModal: false
              });
              (
                this.props.onSelected && this.props.onSelected(this.state.selected)
              );

            }
            }>
                <Text>Confirm</Text>
              </TouchableHighlight>
            </View>

            <Picker
              style={[{borderColor: 'red'}]}
              selectedValue={this.state.selected}
              onValueChange={this.onValueChange.bind(this, 'selected')}
              >
              {(this.state.number).map((i, k=Math.ramdom()) => (
                <Picker.Item key={k} label={i} selected={i} value={i}/>
              ))}
            </Picker>
          </View>
        </Modal>
        <View style={styles.contentContainer}>
          <TouchableHighlight
            underlayColor={Colors.Transparent}
            onPress={() => {this.setState({
              showModal: true
            });
            (this.props.onButtonPress && this.props.onButtonPress(false))
          }}>
            <Text
              style={styles.text}>
              {`$${this.state.selected}`}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },

  text: {
    textAlign: 'right',
    fontSize: Sizes.Text,
    color: Colors.Text
  },

  picker: {
    width: Sizes.Width,
    color: Colors.Text
  },

  close: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: Sizes.OuterFrame,
    paddingLeft: Sizes.OuterFrame
  },

  modal: {
    marginTop: Sizes.Height*(2/3)
  }
});
