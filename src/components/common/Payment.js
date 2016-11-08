import React, {
  Component
} from 'react';
import {
  View,
Text,
TouchableOpacity,
StyleSheet,
ScrollView,
Dimensions,
TextInput,
Image
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
import Field from '../../components/common/Field';
import NewContest from '../../views/forms/NewContest';
import PaymentField from './PaymentField';
import Swiper from 'react-native-swiper';


const SWIPER_HEIGHT = 180;
const {height, width} = Dimensions.get('window');

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: 'name',
      number: '',
      cvc: '',
      expiry:'',
      index: 0,
      type: 'visa'
    }
  }

  onNext() {
    this.swiper.scrollby(1);
  }

  componentDidMount() {
    this.refs['number'].focus();
  }


  onMomentumScrollEnd(e, state, context) {
    var indexMap = [
        'number',
        'name',
        'expiry',
        'cvc',
        'type',
    ];
    this.setState({
        index: state.index,
        focused: indexMap[state.index]
    }, () => {
        try {
            this.refs[indexMap[state.index]].focus();
        } catch(e) {

        }
    });
  }

  render() {
    var cardTypes = [];
    for (var key in CardImages) {
        cardTypes.push({type: key, image: CardImages[key]});
    }

    if (this.state.restoring) {
        return null;
    }

    return (
    <View style={styles.container}>

          <CreditCard
            style={{marginVertical: 10, marginHorizontal: 10, marginBottom: 0, elevation: 3, alignSelf: 'center'}}
            imageFront={require('../../../res/img/card-front.png')}
            imageBack={require('../../../res/img/card-back.png')}
            shiny={false}
            bar={false}
            focused={this.state.focused}
            number={this.state.number}
            name={this.state.name}
            expiry={this.state.expiry}
            cvc={this.state.cvc}/>
          <Swiper
            style={styles.wrapper}
            height={SWIPER_HEIGHT}
            showsButtons={false}
            onMomentumScrollEnd = {this.onMomentumScrollEnd.bind(this)}
            ref={(swiper) => {this.swiper = swiper}}
            index={this.state.index}>
            <View style={styles.slide}>
                <View style={styles.card}>
                    <Text style={styles.textNumber}>CARD NUMBER</Text>
                    <TextInput
                      ref="number"
                      autoFocus={true}
                      value={this.state.number}
                      onChangeText={(number) => this.setState({
                          number
                        })}/>
                </View>
            </View>
            <View style={styles.slide}>
                <View style={styles.card}>
                    <Text style={styles.textName}>CARD HOLDER'S NAME</Text>
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
                    <Text style={styles.textName}>EXPIRY</Text>
                    <TextInput
                      ref="expiry"
                      value={this.state.expiry}
                      onChangeText={(expiry) => this.setState({
                        expiry
                      })}/>
                </View>
            </View>
            <View style={styles.slide}>
                <View style={styles.card}>
                    <Text style={styles.textCvc}>CVV/CVC NUMBER</Text>
                    <TextInput
                      ref="cvc"
                      value={this.state.cvc}
                      onChangeText={(cvc) => this.setState({
                        cvc
                      })}/>
                </View>
            </View>
            <View style={styles.slide}>
                <View style={styles.card}>
                    <Text style={styles.textNumber}>CARD TYPE</Text>
                    <View style={{flexDirection: 'row'}}>
                        {cardTypes.map((cardType) => {
                            return (
                                <TouchableOpacity
                                  key={cardType.type}
                                  onPress={() => this.setState({
                                      type: cardType.type
                                  })}>
                                    <View>
                                        <Image
                                          source={{uri: cardType.image}}                                            style={styles.img} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
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
  wrapper: {
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
      backgroundColor: Colors.ModalBackground,
      borderRadius: 3,
      elevation: 3,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderColor: '#ddd',
      padding: 10,
  }
})
