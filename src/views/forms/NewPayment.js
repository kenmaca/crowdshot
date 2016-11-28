import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Modal, Alert
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
import TitleBar from '../../components/common/TitleBar';
import ProgressBlocker from '../../components/common/ProgressBlocker';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import PriceSelect from '../../components/common/PriceSelect';
import CardSelect from '../../components/common/CardSelect';
import Button from '../../components/common/Button';
import InformationField from '../../components/common/InformationField';

export default class NewPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stripeCardId: null,
      stripeCustomerId: null,
      billingId: null,
      value: null,
      processing: false
    };

    this.charge = this.charge.bind(this);
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.fixedValue) this.setState({
      value: props.fixedValue
    });
  }

  charge() {

    // block view while waiting for server to process charge
    this.setState({
      processing: true
    });

    let transactionId = Database.ref('transactions').push({
      '.value': {
        createdBy: Firebase.auth().currentUser.uid,

        // stripe asks for cents
        value: this.state.value * 100,
        description: this.props.description,
        stripeCardId: this.state.stripeCardId,
        stripeCustomerId: this.state.stripeCustomerId,
        billingId: this.state.billingId,
        dateCreated: Date.now()
      },
      '.priority': -Date.now()
    }).key;
    let ref = Database.ref(
      `transactions/${transactionId}`
    );

    let listener = ref.on('value', data => {
      if (data.exists() && data.val().approved) {

        // outer callback, close listener, and exit
        Actions.pop();
        this.props.onCharged && this.props.onCharged(data.key);
        ref.off('value', listener);
      } else if (data.exists() && data.val().error) {

        // declined
        Alert.alert(
          'Payment Declined',
          'Your card was declined by the issuing bank',
          [
            {
              text: 'OK',
              onPress: () => {

                // remove the charge
                ref.remove();

                // and back out
                Actions.pop();
              }
            }
          ]
        );
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent
          visible={this.state.processing}
          animationType='fade'>
          <ProgressBlocker
            message='Processing payment..' />
        </Modal>
        <TitleBar
          title={
            this.props.titleText || 'Set the Bounty Amount'
          } />
        <View style={styles.content}>
          <CardSelect
            onSelected={card => this.setState({
              stripeCustomerId: card.stripeCustomerId,
              stripeCardId: card.stripeCardId,
              billingId: card.billingId
            })}
            label='Payment Method' />
          {
            this.props.fixedValue == null ? (
              <PriceSelect
                options=
                {
                  {
                    0: [0, 1, 5, 10],
                    1: [20, 30, 50, 60],
                    2: [60, 70, 80, 100]
                  }
                }
                isBottom
                noMargin
                label={
                  this.props.priceText
                  || 'Amount'
                }
                onSelected={amount => this.setState({
                  value: amount
                })}
                subtitle={
                  this.props.priceSubtext
                  || 'Awarded to the winner'
                } />
            ): (
              <InformationField
                label='Amount'
                info={`$${this.props.fixedValue}`} />
            )
          }
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimer}>
              {
                this.props.disclaimerText
                || (
                  'This will be charged immediately to your '
                  + 'chosen payment method at the start of your contest. '
                  + 'This amount can be refunded if the contest is cancelled '
                  + 'due a lack of photos submitted by contestants.'
                )
              }
            </Text>
          </View>
          <Button
            isDisabled={
              this.state.value
              && !this.state.stripeCardId
              && !this.state.stripeCustomerId
            }
            onPress={this.charge}
            onPressDisabled={() => Alert.alert(
              'Unable to process payment',
              'Please fill in all fields before submitting'
            )}
            color={Colors.Primary}
            label={
              this.props.submitText
              || 'Add bounty to contest'
            } />
        </View>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  content: {
    alignItems: 'center'
  },

  disclaimerContainer: {
    padding: Sizes.InnerFrame,
    paddingLeft: Sizes.OuterFrame,
    paddingRight: Sizes.OuterFrame
  },

  disclaimer: {
    textAlign: 'center',
    fontSize: Sizes.SmallText,
    color: Colors.AlternateText
  }
});
