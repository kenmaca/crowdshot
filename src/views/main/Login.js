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
              style={styles.button}
              color={Colors.Facebook}
              fontColor={Colors.Text}
              fontAwesome
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

                          // grab latest data if exists
                          Database.ref(
                            `profiles/${user.uid}`
                          ).once('value', profile => {
                            profile = profile.val() || {};

                            // update the profile
                            Database.ref(
                              `profiles/${user.uid}`
                            ).update({
                              displayName: user.displayName,
                              email: user.email,
                              dateCreated: profile.dateCreated || Date.now()
                            }).then(result => {

                              // now store the photo
                              let photoId = Database.ref(`photos`).push().key;
                              Database.ref().update({
                                [`photos/${photoId}`]: {
                                  createdBy: user.uid,
                                  url: user.photoURL
                                }, [`profiles/${user.uid}/photo`]: photoId
                              });
                            });

                            // user logged in, ready for use
                            Actions.loader();
                          });
                        }).catch(error => {});
                      }
                    );
                  }
                }, error => {
                  console.log("login failed, ", error);
                  Alert.alert("Login Failed");
                });
              }} />
          </Animatable.View>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
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
    alignItems: 'center',
    marginTop: Sizes.InnerFrame
  },

  button: {
    minWidth: Sizes.Width * 0.8
  },

  footerText: {
    textAlign: 'center',
    marginTop: Sizes.InnerFrame / 2,
    marginBottom: Sizes.InnerFrame * 4,
    paddingLeft: Sizes.InnerFrame * 5,
    paddingRight: Sizes.InnerFrame * 5,
    fontSize: Sizes.SmallText,
    color: Colors.Text
  }
});
