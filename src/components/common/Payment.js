import React, {
  Component
} from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Dimensions, TextInput, Image
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import CreditCard, {CardImages} from 'react-native-credit-card';
import Button from '../../components/common/Button';
import NewContest from '../../views/forms/NewContest';
import Swiper from 'react-native-swiper';

const SWIPER_HEIGHT = 150;

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: 'number',
      number: '',
      name: '',
      cvc: '',
      expiry:'',
      index: 0,
      type: 'visa'
    }
  }

  componentDidMount() {
    this.refs[this.state.focused].focus();
  }

  onMomentumScrollEnd(e, state, context) {
    var indexMap = [
        'number',
        'name',
        'expiry',
        'cvc'
    ];
    this.setState({
        index: state.index,
        focused: indexMap[state.index]
    }, () => {
        try {
            this.refs[this.state.focused].focus()
            console.log(this.state.focused)
            console.log(this.refs[this.state.focused].isFocused(0));
        } catch(e) {
        }
    });
  }

  render() {
    return (
    <View style={styles.container}>
          <CreditCard
            style={styles.creditcard}
            imageFront={require('../../../res/img/card-front.png')}
            imageBack={require('../../../res/img/card-back.png')}
            shiny={true}
            bar={true}
            focused={this.state.focused}
            number={this.state.number}
            name={this.state.name}
            expiry={this.state.expiry}
            cvc={this.state.cvc}/>
          <Swiper
            style={styles.swiper}
            height={SWIPER_HEIGHT}
            showsButtons={false}
            onMomentumScrollEnd = {this.onMomentumScrollEnd.bind(this)}
            ref={(swiper) => {this.swiper = swiper}}
            index={this.state.index}>
            <View style={styles.slide}>
              <View style={styles.card}>
                <Text style={styles.text}>-></Text>
              </View>
            </View>
            <View style={styles.slide}>
                <View style={styles.card}>
                    <Text style={styles.text}>CARD NUMBER</Text>
                    <TextInput
                      ref="number"
                      autoFocus={true}
                      keyboardType="number-pad"
                      value={this.state.number}
                      onChangeText={(number) => this.setState({
                          number
                        })}/>
                </View>
            </View>
            <View style={styles.slide}>
                <View style={styles.card}>
                    <Text style={styles.text}>CARD HOLDER'S NAME</Text>
                    <TextInput
                      ref="name"
                      value={this.state.name}
                      onChangeText={(name) => this.setState({
                        name
                      })}/>
                </View>
            </View>
            <View style={styles.slide}>
                <View style={styles.card}>
                    <Text style={styles.text}>EXPIRY</Text>
                    <TextInput
                      ref="expiry"
                      value={this.state.expiry}
                      keyboardType="number-pad"
                      onChangeText={(expiry) => this.setState({
                        expiry
                      })}/>
                </View>
            </View>
            <View style={styles.slide}>
                <View style={styles.card}>
                    <Text style={styles.text}>CVV/CVC NUMBER</Text>
                    <TextInput
                      ref="cvc"
                      value={this.state.cvc}
                      keyboardType="number-pad"
                      onChangeText={(cvc) => this.setState({
                        cvc
                      })}/>
                </View>
            </View>
        </Swiper>
        <Button
          color={Colors.Primary}
          label='Pay'
          squareBorders={9}
          style={styles.buttonStyle}/>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: Colors.Background,
      flex: 1,
      paddingTop: 30
  },
  creditcard: {
      marginVertical: 10,
      marginHorizontal: 10,
      marginBottom: 0,
      elevation: 3,
      alignSelf: 'center'
  },
  swiper: {
      height: SWIPER_HEIGHT,
      backgroundColor: Colors.Background
  },
  slide: {
      height: SWIPER_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center'
  },
  text: {
    color: Colors.Text,
    fontSize: Sizes.Text
  },
  card: {
      marginHorizontal: 10,
      marginBottom: 30,
      backgroundColor: Colors.Background,
      borderRadius: 3,
      elevation: 3,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderColor: Colors.Transparent,
      padding: 10,
  }
})
