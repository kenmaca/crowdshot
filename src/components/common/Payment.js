import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

import CreditCard from 'react-native-credit-card';
import {
  CreditCardInput, LiteCreditCardInput
} from 'react-native-credit-card-input';
import Button from '../../components/common/Button';
import Field from '../../components/common/Field';

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      focused: props.focused,
      number: props.number,
      name: props.name,
      expiry: props.expiry,
      cvc: props.cvc
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.creditContainer}>
          <CreditCard
              type={this.state.type}
              imageFront={require('../../../res/img/card-front.png')}
              imageBack={require('../../../res/img/card-back.png')}
              shiny={true}
              bar={true}
              focused={this.state.focused}
              number={this.state.number}
              name={this.state.name}
              expiry={this.state.expiry}
              cvc={this.state.cvc}/>
        </View>
        <View style={styles.creditContainer}>
          <CreditCardInput onChange={this._onChange}/>
        </View>
        <Button
          color={Colors.Primary}
          label='Pay'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.Background
  },
  creditContainer: {
    height: 40,
    width: Sizes.width - 10,
    backgroundColor: Colors.Background,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  button: {

  }
})
