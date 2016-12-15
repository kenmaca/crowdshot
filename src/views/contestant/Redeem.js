import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, Alert
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import RewardList from '../../components/contestant/RewardList';
import {
  TabViewAnimated, TabBarTop
} from 'react-native-tab-view';

export default class Redeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      cart: {},
      blob: {},
      index: 0,
      routes: []
    };

    // listing of reward categories
    this.ref = Database.ref('rewardCategories');

    // obtain current balance
    this.billingRef = Database.ref(
      `billing/${
        Firebase.auth().currentUser.uid
      }`
    );

    // methods
    this.add = this.add.bind(this);
    this.getCartTotal = this.getCartTotal.bind(this);
    this.getItemTotal = this.getItemTotal.bind(this);
    this.checkout = this.checkout.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.isSufficient = this.isSufficient.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {

    // build tabs
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        let blob = data.val();
        this.setState({
          blob: blob,
          routes: Object.keys(blob).map((categoryId, i) => ({
            key: `${categoryId}`,
            title: blob[categoryId].name
          }))
        });

        // clear loader
        this.refs.title.clearLoader();
      }
    });

    // sum up user balance
    this.billingListener = this.billingRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          balance: -Object.values(
            data.val().transactions || {}
          ).reduce((a, b) => a + b, 0)
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off(
      'value', this.listener
    );

    this.billingListener && this.billingRef.off(
      'value', this.billingListener
    );
  }

  getItemTotal(rewardId, blob, cart) {

    // allow simulated carts
    cart = cart || this.state.cart || {};

    // default single item if never added
    let reward = cart[rewardId] || {
      blob: blob,
      quantity: 0,

      // to indicate not actually added
      simulated: true
    };

    let shipping = (reward.blob.shipping || 0) * (
      reward.blob.collapsable
      ? 1: reward.simulated ? 1: reward.quantity
    );

    let handling = (reward.blob.handling || 0) * (
      reward.blob.collapsable
      ? 1: reward.simulated ? 1: reward.quantity
    );

    let subtotal = reward.quantity * reward.blob.value;
    let total = (
      reward.simulated
      ? subtotal: subtotal + handling + shipping
    );

    return {
      total: total,
      subtotal: subtotal,
      handling: handling,
      shipping: shipping,
      quantity: reward.quantity
    };
  }

  getCartTotal(cart) {
    cart = cart || this.state.cart || {};
    return Object.keys(
      cart

    // calculate item subtotals first
    ).map(rewardId => this.getItemTotal(
      rewardId,
      cart[rewardId].blob,
      cart

    // and now total everything
    ).total).reduce((a, b) => a + b, 0);
  }

  isSufficient(rewardId, rewardBlob, amount) {
    console.log(this.state.balance);
    console.log(this.state.cart);
    console.log(this.getCartTotal());
    let simulatedCart = Object.assign(
      {},
      this.state.cart,
      {
        [rewardId]: {
          quantity: (
            this.state.cart[rewardId]
              ? this.state.cart[rewardId].quantity
              : 0
          ) + amount,
          blob: rewardBlob
        }
      }
    );
    console.log(simulatedCart);
    console.log(this.getCartTotal(simulatedCart));

    return (
      (
        this.state.balance - this.getCartTotal(simulatedCart)
      ) >= 0
    );
  }

  add(rewardId, rewardBlob, amount, onAdded) {

    // default amount
    amount = amount || 1;

    // prevent overadding
    if (this.isSufficient(rewardId, rewardBlob, amount)) {

      // init if fresh object
      if (!this.state.cart[rewardId]) {
        this.state.cart[rewardId] = {
          blob: rewardBlob,
          quantity: 0
        };
      }

      // don't allow negative amounts
      this.state.cart[rewardId].quantity = (
        this.state.cart[rewardId].quantity
      ) + amount;

      // clear from cart if less than 1 quantity
      if (this.state.cart[rewardId].quantity < 1) {
        delete this.state.cart[rewardId];
      }

      // trigger update
      this.setState({
        cart: this.state.cart
      }, onAdded);

    } else {
      Alert.alert(
        'Insufficient balance',
        'This reward can\'t be redeemed due to insufficient funds '
          + 'in your account balance'
      );
    }
  }

  checkout() {

    // validate and push
  }

  close() {
    if (Object.keys(this.state.cart).length > 0) {
      Alert.alert(
        'You have rewards in your cart',
        'Closing this screen will empty your cart',
        [
          {
            text: 'Checkout',
            onPress: this.checkout
          },
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Close',
            onPress: Actions.pop
          }
        ]
      )
    } else {
      Actions.pop();
    }
  }

  handleChangeTab(i) {
    this.setState({
      index: i
    });
  }

  renderScene({route}) {
    return (
      Math.abs(
        this.state.index - this.state.routes.indexOf(route)
      ) > 2 ? null: (
        <RewardList
          categoryId={route.key}
          add={this.add}
          getItemTotal={this.getItemTotal}
          category={this.state.blob[route.key]} />
      )
    );
  }

  renderHeader(props) {
    return (
      <TabBarTop
        {...props}
        scrollEnabled
        style={styles.tabStyle}
        labelStyle={styles.labelStyle}
        indicatorStyle={styles.indicatorStyle} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          clearLoader
          ref='title'
          title='Rewards'>
          <View style={styles.balance}>
            <View style={styles.cartAmount}>
              <Text style={styles.cartAmountText}>
                {
                  `$${
                    (
                      this.getCartTotal()
                      * 0.01
                    ).toFixed(2)
                  }`
                }
              </Text>
              <Icon
                name='shopping-cart'
                color={Colors.Primary}
                size={Sizes.H2} />
            </View>
            <Text style={styles.balanceAmount}>
              {
                `$${
                  (
                    (
                      this.state.balance
                      - this.getCartTotal()
                    ) * 0.01
                  ).toFixed(2)
                } available`
              }
            </Text>
          </View>
        </TitleBar>
        {
          this.state.routes.length > 0
          && (
            <TabViewAnimated
              style={styles.content}
              navigationState={this.state}
              onRequestChangeTab={this.handleChangeTab}
              renderHeader={this.renderHeader}
              renderScene={this.renderScene} />
          )
        }
        <CloseFullscreenButton
          back
          action={this.close} />
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
    flex: 1
  },

  entryContainer: {
    margin: Sizes.InnerFrame / 2,
    marginBottom: 0,
  },

  balance: {
    alignItems: 'flex-end'
  },

  cartAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.InnerFrame / 4
  },

  cartAmountText: {
    marginRight: Sizes.InnerFrame / 2,
    fontSize: Sizes.H2,
    fontWeight: '500',
    color: Colors.Primary
  },

  balanceAmount: {
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.Text
  },

  tabStyle: {
    backgroundColor: Colors.Foreground
  },

  labelStyle: {
    fontSize: Sizes.Text
  },

  indicatorStyle: {
    backgroundColor: Colors.Primary,
    height: Sizes.InnerFrame / 4
  }
});
