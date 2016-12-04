import React, {
  Component
} from 'react';
import {
  View, ActivityIndicator, StyleSheet, StatusBar, Alert
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Strings
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';

/**
 * Handles logging in and redirection to an appropriate View
 * either on app launch or after a login/registration was processed.
 */
export default class Loader extends Component {
  componentDidMount() {

    // globally remove
    StatusBar.setHidden(true, 'slide');

    // handle version check before anything else
    Database.ref('config').once('value', config => {
      config = config.val();

      // unsupported client, so prompt user to update
      if (config.minimumVersion > Strings.ClientVersion) {
        Alert.alert(
          'Please update Crowdshot',
          'You are currently running an older version of Crowdshot that is no '
            + 'longer supported'
        );
      } else {

        // handle currently logged in user
        Firebase.auth().onAuthStateChanged(user => {
          if (user) Actions.main(); else Actions.login();
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating
          size='large'
          color={Colors.Text} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Primary
  }
});
