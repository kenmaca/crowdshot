import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Button from '../../components/common/Button';
import SingleLineInput from '../../components/common/SingleLineInput';
import CircleIcon from '../../components/common/CircleIcon';

export default class NewPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      name: '',
      expiry: '',
      cvc: '',

      // validation
      numberValid: false,
      nameValid: false,
      expiryValid: false,
      cvcValid: false
    };

    this.onChangeNumber = this.onChangeNumber.bind(this);
    this.onChangeExpiry = this.onChangeExpiry.bind(this);
    this.onChangeCvc = this.onChangeCvc.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
  }

  onChangeNumber(card) {
    card = card.split(' ').join('');
    let cardValid = false;
    if (!(/[^0-9-\s]+/.test(card))) {
      let nCheck = 0, nDigit = 0, bEven = false;
      card = card.replace(/\D/g, '');

      for (var n = card.length - 1; n >= 0; n--) {
        var cDigit = card.charAt(n),
          nDigit = parseInt(cDigit, 10);

        if (bEven) {
          if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
      }

      cardValid = (
        (nCheck % 10) == 0
        && card.length === 16
      );
    }

    this.setState({
      number: _spaces(card) || '',
      numberValid: cardValid,
      ready: (
        cardValid
        && this.state.nameValid
        && this.state.cvcValid
        && this.state.expiryValid
      )
    });
  }

  onChangeExpiry(expiry) {
    expiry = expiry.split('/');
    let expiryValid = (
      parseInt(expiry[0]) > 0
      && parseInt(expiry[0]) < 13

      // 2015
      && parseInt(expiry[1]) > 15
    );

    this.setState({
      expiry: _slash(expiry.join('/')) || '',
      expiryValid: expiryValid,
      ready: (
        expiryValid
        && this.state.nameValid
        && this.state.cvcValid
        && this.state.numberValid
      )
    });
  }

  onChangeCvc(cvc) {
    expiry = this.state.expiry.split('/');
    let cvcValid = (
      cvc.length === 3
      && !(/[^0-9-\s]+/.test(cvc))
    );

    this.setState({
      cvc: cvc || '',
      cvcValid: cvcValid,
      ready: (
        cvcValid
        && this.state.nameValid
        && this.state.expiryValid
        && this.state.numberValid
      )
    });
  }

  onChangeName(name) {
    this.setState({
      name: name || '',
      nameValid: name.length > 0,
      ready: (
        name.length > 0
        && this.state.cvcValid
        && this.state.expiryValid
        && this.state.numberValid
      )
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Add a new Credit Card
          </Text>
        </View>
        <View style={styles.content}>
          <SingleLineInput
            isTop
            autoCapitalize='words'
            placeholder='Johnny Appleseed'
            onChangeText={this.onChangeName}
            label='Cardholder Name' />
          <SingleLineInput
            keyboardType='numeric'
            placeholder='●●●● ●●●● ●●●● ●●●●'
            onChangeText={this.onChangeNumber}
            maxLength={19}
            value={this.state.number}
            label='Card Number' />
          <SingleLineInput
            keyboardType='numeric'
            placeholder='MM/YY'
            onChangeText={this.onChangeExpiry}
            value={this.state.expiry}
            maxLength={5}
            label='Expiry' />
          <SingleLineInput
            isBottom
            noMargin
            keyboardType='numeric'
            placeholder='●●●'
            onChangeText={this.onChangeCvc}
            maxLength={3}
            label='CVC' />
          <View style={styles.security}>
            <CircleIcon
              fontAwesome
              color={Colors.Transparent}
              icon='cc-stripe'
              size={28} />
            <Text style={styles.securityText}>
              Your credit card data is handled by Stripe and never stored on our servers.
            </Text>
          </View>
          <Button
            isDisabled={!this.state.ready}
            onPress={Actions.pop}
            color={Colors.Primary}
            label='Add Credit Card' />
        </View>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  titleContainer:{
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Sizes.InnerFrame,
    height: Sizes.NavHeight,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H3
  },

  content: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  },

  security: {
    margin: Sizes.InnerFrame / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  securityText: {
    marginLeft: Sizes.InnerFrame / 2,
    fontSize: Sizes.SmallText,
    color: Colors.Text
  }
});

function _spaces(card) {
  card = card.split(' ').join('');
  if (card.length > 0) {
    return card.match(new RegExp('.{1,4}', 'g')).join(' ');
  }
}

function _slash(expiry) {
  expiry = expiry.split('/').join('');
  if (expiry.length > 0) {
    return expiry.match(new RegExp('.{1,2}', 'g')).join('/');
  }
}
