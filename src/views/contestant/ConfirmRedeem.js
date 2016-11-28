import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, Alert, Modal, Image
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
import Button from '../../components/common/Button';
import TitleBar from '../../components/common/TitleBar';
import InputSectionHeader from '../../components/common/InputSectionHeader';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import AwardCard from '../../components/lists/AwardCard';
import Swipeout from 'react-native-swipeout';

export default class ConfirmRedeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      cartList: [],
      cartAmt: 0,
      finalizedVisible: false
    };

    this.profileRef = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }`
    );

    this.ordersRef = Database.ref(
      `orders/`
    );

  }

  componentDidMount() {
    this.profileListener = this.profileRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          profile: data.val(),
        });
      }
    });

    let {cart, rawAwards} = this.props;
    let cartList = [];
    let cartAmt = 0;
    for (award in rawAwards){
      if (cart[award]){
        let cartItem = {};
        cartItem.id = award;
        cartItem.name = rawAwards[award].name;
        cartItem.cost = rawAwards[award].cost;
        cartItem.quantity = cart[award];
        cartList.push(cartItem);
        cartAmt += cartItem.cost * cartItem.quantity;
      }
    }
    this.setState({
      cartList,
      cartAmt
    });

  }

  componentWillUnmount() {
    this.profileListener && this.profileRef.off('value', this.profileListener);
  }

  confirm(){
    let { cartList } = this.state;
    let awards = {};
    for (var cartItem in cartList){
      awards[cartList[cartItem].id] = {
        quantity: cartList[cartItem].quantity
      }
    }
    //create order in db
    let orderId = this.ordersRef.push({
      '.value': {
        createdBy: Firebase.auth().currentUser.uid,
        dateCreated: Date.now(),
        awards: awards
      },
      '.priority': -Date.now()
    }).key

    //add order reference in profile to db
    Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/orders/${
        orderId
      }`
    ).set({
      '.value': true,
      '.priority': -Date.now()
    });

    //TODO: add transaction stuff to deduct wallet

    this.setState({
      finalizedVisible: true
    })
  }

  renderCart(){
    let { cartList } = this.state;
    let cartView = [];
    if (this.state.cartList){
      for (var cartItem in cartList){
        cartView.push(
          <View
            key={cartList[cartItem].id}
            style={styles.cartItem}>
            <View>
              <Text style={styles.cartText}>
                {cartList[cartItem].name
                  + '   x ' + cartList[cartItem].quantity}
              </Text>
            </View>
            <View>
              <Text style={styles.cartText}>
                {'$' + cartList[cartItem].quantity * cartList[cartItem].cost}
              </Text>
            </View>
          </View>
        )
      }
    }
    return cartView;
  }

  render(){
    let { profile } = this.state

    return (
      <View style={styles.container}>
        <TitleBar
          ref='title'
          title='Confirmation' />
        <View style={styles.content}>
          <InputSectionHeader
            offset={Sizes.InnerFrame}
            label='Your shipping address' />
          <Text style={styles.address}>
            {profile.address + '\n' + profile.city
              + (profile.region ? ', ' + profile.region + '\n' : '\n')
              + profile.country
              + (profile.postal ? ', ' + profile.postal : '')}
          </Text>
          <InputSectionHeader
            offset={Sizes.InnerFrame}
            label='Your cart' />
          <View style={styles.cartContainer}>
            {this.renderCart()}
            <View style={[styles.cartItem, styles.cartSummary]}>
              <View>
                <Text style={styles.cartSummaryText}>
                  Total Redemption
                </Text>
              </View>
              <View>
                <Text style={styles.cartSummaryText}>
                  {'$' + this.state.cartAmt}
                </Text>
              </View>
            </View>
            <View style={[styles.cartItem, styles.balanceSummary]}>
              <View>
                <Text style={styles.cartSummaryText}>
                  Your Current Balance
                </Text>
              </View>
              <View>
                <Text style={styles.cartSummaryText}>
                  {'$' + this.state.profile.wallet}
                </Text>
              </View>
            </View>
            <View style={styles.cartItem}>
              <View>
                <Text style={styles.cartSummaryText}>
                  Your Balance After Redemption
                </Text>
              </View>
              <View>
                <Text style={styles.cartSummaryText}>
                  {'$' + (this.state.profile.wallet - this.state.cartAmt)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Button
          squareBorders
          color={Colors.Primary}
          onPress={() => this.confirm()}
          label={"Confirm"} />
        <CloseFullscreenButton />
        <Modal
          visible={this.state.finalizedVisible}
          animationType='slide'>
          <View style={styles.finalizedContainer}>
            <View style={styles.textContainer}>
              <Text style={[
                styles.text,
                styles.title
              ]}>
                Yussss!
              </Text>
              <Text style={[
                styles.text,
                styles.description
              ]}>
                You've selected the awards you deserved for your awesome photos.
                We will ship out your awards very soon!
              </Text>
              <Button
                onPress={() => {
                  // remove overlay
                  this.setState({
                    finalizedVisible: false
                  });

                  // completed contest view
                  Actions.pop({
                    popNum: 2
                  });
                }}
                label='Done'
                color={Colors.Background} />
            </View>
            <Image
              source={require('../../../res/img/finalized.png')}
              style={styles.finalizedPhoto} />
          </View>
        </Modal>
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
    marginTop: Sizes.OuterFrame
  },

  address: {
    color: Colors.AlternateText,
    fontWeight: '100',
    marginHorizontal: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame
  },

  cartContainer: {
    marginVertical: Sizes.InnerFrame/2,
    marginHorizontal: Sizes.InnerFrame*2,
  },

  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  cartSummary: {
    marginTop: Sizes.InnerFrame/2,
    paddingTop: Sizes.InnerFrame/2,
    borderTopWidth: 1,
    borderColor: Colors.AlternateText
  },

  balanceSummary: {
    marginTop: Sizes.InnerFrame/2,
    paddingTop: Sizes.InnerFrame/2,
  },

  cartText: {
    color: Colors.AlternateText,
    fontWeight: '100',
  },

  cartSummaryText: {
    color: Colors.AlternateText,
    fontWeight: '500',
  },

  finalizedContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.Primary
  },

  finalizedPhoto: {
    width: 350,
    height: 350
  },

  textContainer: {
    padding: Sizes.OuterFrame,
    alignItems: 'center'
  },

  title: {
    marginTop: Sizes.InnerFrame * 3,
    fontSize: Sizes.H1,
    fontWeight: '600'
  },

  text: {
    color: Colors.AlternateText
  },

  description: {
    padding: Sizes.InnerFrame,
    textAlign: 'center',
    fontSize: Sizes.H4
  },
});
