import React, {
  Component
} from 'react';
import {
  View, Text, StyleSheet, Image, StatusBar, Alert
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
import Photo from '../../components/common/Photo';
import Button from '../../components/common/Button';

export default class Login extends Component {
  render() {
    StatusBar.setHidden(true, 'slide');

    return (
      <Photo
        photoId='appLoginBackground'
        style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <Text style={[styles.text]}>
              Throw out that selfie stick
            </Text>
            <Text style={[styles.text, styles.title]}>
              Your nicest photos are usually taken by other people
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
        <Button
          squareBorders
          style={{
            paddingTop: Sizes.InnerFrame,
            paddingBottom: Sizes.InnerFrame
          }}
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

                      // update profile
                      Database.ref(
                        `profiles/${user.uid}`
                      ).set({
                        displayName: user.displayName,
                        email: user.email,
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
                    }).catch(error => {});
                  }
                );
              }
            }, error => {
              console.log("login failed, ", error);
              Alert.alert("Login Failed");
            });
          }} />
      </Photo>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.Background
  },

  header: {
    flex: 1,
    padding: Sizes.InnerFrame,
    paddingTop: Sizes.InnerFrame * 2,
    backgroundColor: Colors.Overlay
  },

  headerContainer: {
    alignSelf: 'stretch',
    borderRadius: 10
  },

  text: {
    fontSize: Sizes.H2 * 1.25,
    color: Colors.Text,
    backgroundColor: Colors.Transparent,
    fontWeight: '100'
  },

  title: {
    fontSize: Sizes.H1 * 1.25,
    fontWeight: '200'
  },

  footer: {
    alignItems: 'center',
    backgroundColor: Colors.Overlay,
    padding: Sizes.InnerFrame / 2
  },

  footerText: {
    textAlign: 'center',
    padding: Sizes.InnerFrame / 3,
    fontSize: Sizes.SmallText,
    color: Colors.Text
  }
});
