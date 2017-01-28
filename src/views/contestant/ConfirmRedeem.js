import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, Alert, Image,
  Modal, TouchableOpacity, Platform
} from 'react-native';
import {
  Colors, Sizes, Strings
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import Button from '../../components/common/Button';
import TitleBar from '../../components/common/TitleBar';
import InputSectionHeader from '../../components/common/InputSectionHeader';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Swipeout from 'react-native-swipeout';
import Photo from '../../components/common/Photo';
import CircleIcon from '../../components/common/CircleIcon';
import ProgressBlocker from '../../components/common/ProgressBlocker';

export default class ConfirmRedeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false
    };
    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }`
    );

    // methods
    this.renderRow = this.renderRow.bind(this);
    this.getAddress = this.getAddress.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  confirm() {

    // validate order
    if (Object.keys(this.props.cart).length <= 0) {
      Alert.alert(
        'Your selection is empty',
        'You have no rewards selected'
      );
    } else if (this.getAddress().length < 5) {
      Alert.alert(
        'Incomplete shipping address',
        'Please fill in your entire shipping address'
      );
    } else if (this.props.balance < this.props.getCartTotal()) {
      Alert.alert(
        'Insufficient balance',
        'Your order could not be processed due to a lack of funds '
          + 'in your account balance'
      );
    } else {

      // process order and block view while processing
      this.setState({
        processing: true
      });

      // attempt credit account process before we create the
      // order
      let dateCreated = Date.now();
      let transactionId = Database.ref('transactions').push({
        '.value': {
          createdBy: Firebase.auth().currentUser.uid,
          value: this.props.getCartTotal(),
          description: 'Rewards Redemption',
          billingId: Firebase.auth().currentUser.uid,
          internal: true,
          dateCreated: dateCreated
        },
        '.priority': -dateCreated
      }).key;

      // wait for approval on transaction before order creation
      this.transactionRef = Database.ref(
        `transactions/${transactionId}`
      );
      this.transactionListener = this.transactionRef.on('value', data => {
        if (data.exists() && data.val().approved) {

          // looks good, create the order
          let orderId = Database.ref('orders').push({
            '.value': {
              createdBy: Firebase.auth().currentUser.uid,
              dateCreated: dateCreated,
              address: this.state.address,
              city: this.state.city,
              region: this.state.region,
              postal: this.state.postal,
              country: this.state.country,
              items: Object.assign(
                {},
                ...Object.keys(this.props.cart).map(rewardId => ({
                  [rewardId]: this.props.cart[rewardId].quantity
                }))
              ),
              transactionId: transactionId,
              totalCost: this.props.getCartTotal()
            },
            '.priority': -dateCreated
          }).key;

          // and push to profile list of orders
          Database.ref(
            `profiles/${
              Firebase.auth().currentUser.uid
            }/orders/${
              orderId
            }`
          ).set({
            '.value': true,
            '.priority': -dateCreated
          });

          // TODO: success modal should be here
          Actions.pop({
            popNum: 2
          });
        }
      });
    }
  }

  getAddress() {
    return [
      this.state.address,
      this.state.city,
      this.state.region,
      this.state.postal,
      this.state.country,
    ].filter(part => part);
  }

  renderRow(rewardId) {
    let rewardCost = this.props.getItemTotal(
      rewardId,
      this.props.cart[rewardId].blob,
      this.props.cart
    );

    return (
      <View style={styles.cartItemContainer}>
        <Photo
          photoId={this.props.cart[rewardId].blob.thumbnail}
          style={styles.rewardThumbnail} />
        <Text style={styles.rewardTitle}>
          {this.props.cart[rewardId].blob.name}
        </Text>
        <Text style={styles.rewardCost}>
          {
            `$${
              (rewardCost.subtotal * 0.01).toFixed(2)
            }`
          }
        </Text>
      </View>
    )
  }

  render() {
    let costs = Object.keys(this.props.cart).map(
      rewardId => this.props.getItemTotal(
        rewardId,
        this.props.cart[rewardId].blob,
        this.props.cart
      )
    ).reduce((a, b) => ({
      handling: a.handling + b.handling,
      shipping: a.shipping + b.shipping,
      quantity: a.quantity + b.quantity,
      total: a.total + b.total
    }), {
      handling: 0, shipping: 0, quantity: 0, total: 0
    });

    return (
      <View style={styles.container}>
        <Modal
          transparent
          visible={this.state.processing}
          onRequestClose={() => true}
          animationType='fade'>
          <ProgressBlocker
            message='Processing order..' />
        </Modal>
        <TitleBar
          ref='title'
          title='Confirmation' />
        <View style={styles.content}>
          <TouchableOpacity
            onPress={Actions.address}>
            <InputSectionHeader
              label='Shipping to' />
            <View style={styles.addressContainer}>
              <Text style={styles.address}>
                {
                  `${
                    this.getAddress().join(', ')

                    || 'Add a shipping address'
                  }`
                }
              </Text>
              <CircleIcon
                icon='arrow-forward'
                size={Sizes.InnerFrame}
                color={Colors.AlternateText} />
            </View>
          </TouchableOpacity>
          <InputSectionHeader
            label='Rewards' />
          <ListView
            enableEmptySections
            scrollEnabled
            style={styles.cart}
            renderRow={this.renderRow}
            dataSource={
              new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 != r2
              }).cloneWithRows(
                Object.keys(this.props.cart || {})
              )
            } />
          {
            costs.shipping || costs.handling
            ? (
              <InputSectionHeader
                label='Other Charges' />
            ): (
              <View />
            )
          }
          {
            costs.shipping > 0 && (
              <View style={[
                styles.cartItemContainer,
                styles.totalLine
              ]}>
                <Text style={styles.rewardTitle}>
                  Shipping
                </Text>
                <Text style={styles.rewardCost}>
                  {
                    `$${
                      (costs.shipping * 0.01).toFixed(2)
                    }`
                  }
                </Text>
              </View>
            )
          }
          {
            costs.handling > 0 && (
              <View style={[
                styles.cartItemContainer,
                styles.totalLine
              ]}>
                <Text style={styles.rewardTitle}>
                  Handling
                </Text>
                <Text style={styles.rewardCost}>
                  {
                    `$${
                      (costs.handling * 0.01).toFixed(2)
                    }`
                  }
                </Text>
              </View>
            )
          }
          <InputSectionHeader
            label='Totals' />
          <View style={[
            styles.cartItemContainer,
            styles.totalLine
          ]}>
            <Text style={styles.rewardTitle}>
              Total
            </Text>
            <Text style={[
              styles.rewardCost,
              styles.rewardTitle
            ]}>
              {
                `$${
                  (costs.total * 0.01).toFixed(2)
                }`
              }
            </Text>
          </View>
          <View style={[
            styles.cartItemContainer,
            styles.totalLine
          ]}>
            <Text style={styles.rewardTitle}>
              Credits Remaining
            </Text>
            <Text style={styles.rewardCost}>
              {
                `$${
                  ((
                    this.props.balance - costs.total
                  ) * 0.01).toFixed(2)
                }`
              }
            </Text>
          </View>
          <Text style={styles.disclaimer}>
            {Platform.OS === 'ios' ? Strings.AppleDisclaimer : Strings.GoogleDisclaimer}
          </Text>
        </View>
        <Button
          squareBorders
          color={Colors.Primary}
          onPress={this.confirm}
          label='Confirm Reward Redemption' />
        <CloseFullscreenButton back />
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
    flex: 1,
    margin: Sizes.OuterFrame
  },

  addressContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: Sizes.InnerFrame
  },

  address: {
    flex: 1,
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.AlternateText
  },

  cart: {
    marginBottom: Sizes.InnerFrame
  },

  cartItemContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: Sizes.InnerFrame,
    marginBottom: 2,
    backgroundColor: Colors.ModalForeground
  },

  rewardThumbnail: {
    width: Sizes.OuterFrame,
    height: Sizes.OuterFrame,
    borderRadius: Sizes.OuterFrame / 2,
    marginRight: Sizes.InnerFrame
  },

  rewardTitle: {
    fontSize: Sizes.Text,
    fontWeight: '500',
    color: Colors.AlternateText
  },

  rewardCost: {
    flex: 1,
    textAlign: 'right',
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.SubduedText
  },

  totalLine: {
    backgroundColor: Colors.Transparent,
    paddingTop: 0
  },

  disclaimer: {
    color: Colors.SubduedText,
    fontSize: Sizes.SmallText
  }
});
