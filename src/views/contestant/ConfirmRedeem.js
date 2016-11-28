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
      cartList: []
    };

    this.profileRef = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }`
    );

  }

  componentDidMount() {
    this.profileListener = this.profileRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          profile: data.val(),
          cartAmt: 0
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
                  Total
                </Text>
              </View>
              <View>
                <Text style={styles.cartSummaryText}>
                  {'$' + this.state.cartAmt}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Button
          squareBorders
          color={Colors.Primary}
          onPress={() => this.checkOut()}
          label={"Confirm"} />
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
    marginVertical: Sizes.InnerFrame,
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

  cartText: {
    color: Colors.AlternateText,
    fontWeight: '100',
  },

  cartSummaryText: {
    color: Colors.AlternateText,
    fontWeight: '500',
  }

});
