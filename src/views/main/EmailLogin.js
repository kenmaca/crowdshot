import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Modal, Alert
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
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import SingleLineInput from '../../components/common/SingleLineInput';
import Button from '../../components/common/Button';
import ProgressBlocker from '../../components/common/ProgressBlocker';

export default class EmailLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false
    };

    // methods
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  login() {

    if (this.state.email && this.state.password) {

      // block view
      this.setState({
        processing: true
      }, () => Firebase.auth().signInWithEmailAndPassword(
        this.state.email,
        this.state.password
      ).then(Actions.loader).catch(error => {
        switch(error.code) {
          case 'auth/user-not-found':
            this.register();
            break;
          case 'auth/user-disabled':

            // enable view again
            Alert.alert(
              'Account disabled',
              'Please contact support',
              [
                {
                  text: 'OK',
                  onPress: () => this.setState({
                    processing: false
                  })
                }
              ]
            );
            break;
          case 'auth/account-exists-with-different-credential':

            // enable view again
            Alert.alert(
              'Please sign-in via Facebook',
              'Your account was created via Facebook login. '
                + 'Please sign-in with your Facebook account instead',
              [
                {
                  text: 'OK',
                  onPress: Actions.pop
                }
              ]
            );
            break;
          default:

            // enable view again
            Alert.alert(
              'Login failed',
              error.message,
              [
                {
                  text: 'OK',
                  onPress: () => this.setState({
                    processing: false
                  })
                }
              ]
            );
            break;
        }
      }));
    } else {
      Alert.alert(
        'Incomplete fields',
        'Please fill in all fields'
      );
    }
  }

  register() {
    Firebase.auth().createUserWithEmailAndPassword(
      this.state.email,
      this.state.password
    ).then(Actions.loader).catch(error => {

      // enable view again
      Alert.alert(
        'Registration failed',
        error.message,
        [
          {
            text: 'OK',
            onPress: () => this.setState({
              processing: false
            })
          }
        ]
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent
          visible={this.state.processing}
          onRequestClose={() => true}
          animationType='fade'>
          <ProgressBlocker
            message='Logging in..' />
        </Modal>
        <TitleBar title='Sign-in with an email' />
        <View style={styles.content}>
          <SingleLineInput
            onChangeText={email => this.setState({
              email: email
            })}
            keyboardType='email-address'
            label='Email' />
          <SingleLineInput
            isBottom
            secureTextEntry
            onChangeText={password => this.setState({
              password: password
            })}
            label='Password' />
          <Button
            label='Sign-in to Crowdshot'
            onPress={this.login}
            color={Colors.Primary}
            style={styles.button} />
        </View>
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
    alignItems: 'center'
  }
});
