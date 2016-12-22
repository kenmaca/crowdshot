import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Image, Alert
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
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import InformationField from '../../components/common/InformationField';
import ProfileSettings from '../../components/profiles/ProfileSettings';
import Toggle from '../../components/common/Toggle';
import HeaderButtons from '../../components/common/HeaderButtons';
import HeaderButton from '../../components/common/HeaderButton';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `profiles/${Firebase.auth().currentUser.uid}`
    );

    // methods
    this.logout = this.logout.bind(this);
  }

  logout() {
    Alert.alert(
      'Sign out your account',
      'You will need to sign in again with your account password or with '
        + 'Facebook login',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        }, {
          text: 'OK',
          onPress: () => Firebase.auth().signOut().then(
            Actions.loader
          )
        }
      ]
    );
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

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title='Settings' />
        <View style={styles.content}>
          <ProfileSettings
            color={Colors.Foreground} />
          <InformationField
            pressable
            onPress={Actions.address}
            color={Colors.Background}
            label='Shipping Address'
            info={
              this.state.address && (
                `${
                  this.state.address
                }, ${
                  this.state.city
                } ${
                  this.state.postal
                }`
              )
            } />
          <InformationField
            pressable
            onPress={() => Actions.paymentMethods({
              title: 'Payment Methods',
              onSelected: billing => Actions.paymentMethod({
                billingId: billing.billingId
              })
            })}
            color={Colors.Background}
            label='Transaction History' />
          <Toggle
            isBottom
            onChange={value => this.ref.update({
              blockNotifications: !value
            })}
            active={!this.state.blockNotifications}
            color={Colors.Background}
            label='Receive Notifications'
            subtitle={
              'Toggle all notifications for chat, nearby contests, '
              + 'and contest updates'
            } />
          <View style={styles.footer}>
            <Image
              style={styles.logo}
              source={require('../../../res/img/logo.png')} />
            <Text style={styles.tagline}>
              from <Text style={styles.bold}>Toronto</Text> with ❤️
            </Text>
            <Text style={styles.version}>
              {
                `v${Strings.ClientVersion}`
              }
            </Text>
          </View>
        </View>
        <HeaderButtons>
          <HeaderButton
            icon='exit-to-app'
            onPress={this.logout} />
        </HeaderButtons>
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

  footer: {
    marginTop: Sizes.OuterFrame,
    alignItems: 'center',
    justifyContent: 'center'
  },

  logo: {
    width: 40,
    height: 40,
    margin: Sizes.InnerFrame / 2
  },

  tagline: {
    fontSize: Sizes.SmallText,
    color: Colors.SubduedText
  },

  bold: {
    fontWeight: '500'
  },

  version: {
    marginTop: Sizes.InnerFrame / 4,
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.Overlay
  }
});
