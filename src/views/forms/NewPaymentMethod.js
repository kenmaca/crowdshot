import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Alert, Modal
} from 'react-native';
import {
  Colors, Sizes, Strings
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';
import Base64 from 'base-64';

// components
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Button from '../../components/common/Button';
import SingleLineInput from '../../components/common/SingleLineInput';
import CircleIcon from '../../components/common/CircleIcon';
import ProgressBlocker from '../../components/common/ProgressBlocker';

export default class NewPaymentMethod extends Component {
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
      cvcValid: false,

      // views
      processing: false
    };

    this.onChangeNumber = this.onChangeNumber.bind(this);
    this.onChangeExpiry = this.onChangeExpiry.bind(this);
    this.onChangeCvc = this.onChangeCvc.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.addCard = this.addCard.bind(this);

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/stripeCustomerId`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      this.setState({
        stripeCustomerId: data.val() || false
      });
    })
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  addCard() {
    let card = {
      'card[number]': this.state.number,
      'card[exp_month]': this.state.expiry.split('/')[0],
      'card[exp_year]': this.state.expiry.split('/')[1],
      'card[cvc]': this.state.cvc,
      'card[name]': this.state.name
    }

    fetch(
      `https://api.stripe.com/v1/tokens`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${
            Base64.encode(`${Strings.StripeAPI}:`)
          }`
        },
        body: Object.keys(card).map(
          key => `${encodeURIComponent(key)}=${
            encodeURIComponent(card[key])
          }`
        ).join('&')
      }
    ).then(response => {
      return response.json();
    }).then(json => {
      if (json.error) {
        Alert.alert(
          'Deposit Failed',
          json.error.message,
          [{text: 'OK'}]
        );

        // and reset button
        this.refs.submit.reset();

      } else {

        // card token recieved, let server add to
        // customer object
        let billingId = Database.ref('billing').push({
          stripeToken: json.id,
          createdBy: Firebase.auth().currentUser.uid,
          stripeCustomerId: this.state.stripeCustomerId
        }).key;
        Database.ref(
          `profiles/${
            Firebase.auth().currentUser.uid
          }/billing/${
            billingId
          }`
        ).set(true);

        // block view and wait for successful card add
        this.setState({
          processing: true
        });
        Database.ref(
          `billing/${billingId}`
        ).on('value', data => {

          // successful
          if (data.exists() && data.val().active) {
            Actions.pop();

          // declined
          } else if (data.exists() && data.val().error) {
            Alert.alert(
              'Card Declined',
              'Your card was declined by the issuing bank',
              [
                {
                  text: 'OK',
                  onPress: () => {

                    // remove the card
                    Database.ref(
                      `billing/${data.key}`
                    ).remove();

                    // and back out
                    Actions.pop();
                  }
                }
              ]
            );
          }
        })
      }
    });
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
    if (this.state.stripeCustomerId === false) Alert.alert(
      'Account under Review',
      'Please try again in a few minutes as your billing account '
      + 'is currently under review.',
      [{
        text: 'OK',
        onPress: Actions.pop
      }]
    );

    return (
      <View style={styles.container}>
        <Modal
          transparent
          visible={this.state.processing}
          animationType='slide'>
          <ProgressBlocker
            message='Contacting bank..' />
        </Modal>
        <TitleBar title='Add a new Credit Card' />
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
            ref='submit'
            isDisabled={!this.state.ready}
            onPress={this.addCard}
            onPressDisabled={() => Alert.alert(
              'Unable to add card',
              'Please fill in all fields before submitting'
            )}
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
