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
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import AwardCard from '../../components/lists/AwardCard';
import Swipeout from 'react-native-swipeout';

export default class Redeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      rawAwards: {},
      awards: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      cartAmt: 0,
      cart: {}
    };

    this.ref = Database.ref(
      `awards/`
    );

    this.profileRef = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }`
    );

    this.addToCart = this.addToCart.bind(this);
    this.showAwardDetail = this.showAwardDetail.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {

      // dont check exists due to empty entries allowed
      let blob = data.val() || {};
      this.setState({
        rawAwards: blob,
        awards: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        }).cloneWithRows(
          Object.keys(blob)
        )
      });

      // and clear loader
      this.refs.title.clearLoader();
    });

    this.profileListener = this.profileRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          profile: data.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.profileListener && this.profileRef.off('value', this.profileListener);
  }

  renderRow(awardId) {
    return (
      <View style={styles.entryContainer}>
        <Swipeout
          right={[
            {
              text: 'Remove',
              color: Colors.Text,
              backgroundColor: Colors.Cancel,
              onPress: () => {
                let { cart, cartAmt, rawAwards} = this.state;
                if (cart[awardId] && cart[awardId] > 0) {
                  cart[awardId]--;
                  cartAmt -= rawAwards[awardId].cost;
                  this.setState({
                    cart,
                    cartAmt
                  });
                }
              }
            }
          ]}>
          <AwardCard
            awardId={awardId}
            balance={this.state.profile.wallet - this.state.cartAmt}
            addToCart={this.addToCart}
            showAwardDetail={this.showAwardDetail}
            inCart={this.state.cart[awardId]} />
        </Swipeout>
      </View>
    );
  }

  addToCart(awardId){
    let { cart, cartAmt, rawAwards} = this.state;
    if (cart[awardId]) {
      cart[awardId]++;
    } else {
      cart[awardId] = 1;
    }
    cartAmt += rawAwards[awardId].cost;
    this.setState({
      cart,
      cartAmt
    });
  }

  showAwardDetail(awardId){

  }

  checkOut(){
    let { profile } = this.state;
    if (!profile.address || !profile.city || !profile.country) {
      Actions.address({
        afterSubmit: Actions.confirmRedeem({
          cart: this.state.cart,
          rawAwards: this.state.rawAwards
        })
      });
    } else {
      let longAddress = profile.address + ', ' + profile.city + ', '
        + (profile.region ? profile.region + ', ' : '')
        + profile.country
        + (profile.postal ? ', ' + profile.postal : '');
      Alert.alert(
        'Verify Your Shipping Address',
        longAddress,
        [
          {text: 'Update', onPress: () => {
            Actions.address({
              afterSubmit: Actions.confirmRedeem({
                cart: this.state.cart,
                rawAwards: this.state.rawAwards
              })
            })
          }},
          {text: 'Confirm', onPress: () => Actions.confirmRedeem({
            cart: this.state.cart,
            rawAwards: this.state.rawAwards,
          })}
        ]
      )
    }
  }

  getCartCount(){
    let {cart, rawAwards} = this.state;
    let cartCount = 0;
    for (award in rawAwards){
      cartCount += cart[award] || 0;
    }
    return cartCount;
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          clearLoader
          ref='title'
          title='Redeem Your Prizes'
          rightIcon='trophy'
          rightTitle={
            `$${
              (this.state.profile.wallet
              || 0) - this.state.cartAmt
            }`
          }/>
        <View style={styles.content}>
          <ListView
            scrollEnabled
            dataSource={this.state.awards}
            style={styles.entries}
            renderRow={this.renderRow.bind(this)} />
        </View>
        <Button
          squareBorders
          color={Colors.Primary}
          onPress={() => this.checkOut()}
          label={"Check Out"}
          isDisabled={this.getCartCount() <= 0}
          onPressDisabled={() => Alert.alert(
            'Empty Cart',
            'You don\'t have anything in your cart'
          )}
          disabledColor={Colors.MediumDarkOverlay} />
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
    flex: 1
  },

  entries: {
    flex: 1
  },

  entryContainer: {
    margin: Sizes.InnerFrame / 2,
    marginBottom: 0,
  }
});
