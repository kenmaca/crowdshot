import React, {
  Component
} from 'react';
import {
  View, Text, StyleSheet, Image, Alert
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Sizes
} from '../../Const';
import {
  LoginManager, AccessToken
} from 'react-native-fbsdk';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';

// components
import Button from '../../components/common/Button';
import * as Animatable from 'react-native-animatable';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Divider from '../../components/common/Divider';

export default class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Animatable.View animation='bounceIn'>
            <Image
              source={require('../../../res/img/logo.png')}
              style={styles.logo} />
          </Animatable.View>
          <Text style={[styles.text, styles.title]}>
            Let's get started
          </Text>
        </View>
        <View style={styles.footer}>
          <Animatable.View animation='bounceIn'>
            <Button
              fontAwesome
              style={styles.button}
              color={Colors.Facebook}
              fontColor={Colors.Text}
              icon='facebook'
              label='Login with Facebook'
              onPress={() => {
                LoginManager.logInWithReadPermissions([
                  'public_profile',
                  'email'
                ]).then(result => {
                  if (!result.isCancelled) {
                    AccessToken.getCurrentAccessToken().then(
                      data => {
                        Firebase.auth().signInWithCredential(
                          Firebase.auth.FacebookAuthProvider.credential(
                            data.accessToken.toString()
                          )
                        ).then(user => {

                          // update the profile photo
                          let photoId = Database.ref('photos').push().key;
                          Database.ref().update({
                            [`photos/${photoId}`]: {
                              createdBy: user.uid,
                              url: user.photoURL
                            }, [`profiles/${user.uid}/photo`]: photoId
                          });

                          // user logged in, ready for use
                          Actions.loader();
                        }).catch(error => {});
                      }
                    );
                  }
                }, error => {
                  Alert.alert(
                    'Login failed',
                    'There was an issue signing in via Facebook. '
                     + 'Please try again later'
                  );
                });
              }} />
          </Animatable.View>
        </View>
        <Text style={styles.footerText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
        <Divider
          style={styles.divider} />
        <Button
          squareBorders
          label='Sign in with email instead'
          onPress={Actions.emailLogin}
          color={Colors.LightOverlay}
          style={styles.signIn} />
        <CloseFullscreenButton
          back
          action={Actions.onboarding} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Primary
  },

  header: {
    flex: 1,
    margin: Sizes.OuterFrame,
    alignItems: 'center',
    justifyContent: 'center'
  },

  logo: {
    width: 50,
    height: 50,
    marginBottom: Sizes.InnerFrame / 2
  },

  text: {
    textAlign: 'center',
    fontSize: Sizes.H2,
    color: Colors.Text,
    backgroundColor: Colors.Transparent,
    fontWeight: '100'
  },

  title: {
    fontSize: Sizes.H1,
    fontWeight: '200'
  },

  footer: {
    alignItems: 'center'
  },

  button: {
    minWidth: Sizes.Width * 0.8
  },

  footerText: {
    textAlign: 'center',
    marginTop: Sizes.InnerFrame * 3,
    marginBottom: Sizes.InnerFrame / 2,
    paddingLeft: Sizes.OuterFrame,
    paddingRight: Sizes.OuterFrame,
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.MediumWhiteOverlay
  },

  signIn: {
    width: Sizes.Width
  },

  divider: {
    backgroundColor: Colors.LightWhiteOverlay
  }
});
