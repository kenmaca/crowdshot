import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Alert, Platform, StatusBar
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

export default class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `profiles/${Firebase.auth().currentUser.uid}`
    );

    // methods
    this.onDisplayNameChange = this.onDisplayNameChange.bind(this);
    this.submit = this.submit.bind(this);
    this.exit = this.exit.bind(this);
  }

  componentDidMount() {
    StatusBar.setHidden(false, 'slide');
    Platform.OS !== 'ios'
      && StatusBar.setBackgroundColor(Colors.Background, true);
      
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

  onDisplayNameChange(displayName) {
    this.setState({
      displayName: displayName.replace(
        /\w\S*/g,
        txt => (
          txt.charAt(0).toUpperCase()
          + txt.substr(1).toLowerCase()
        )
      )
    });
  }

  submit() {
    if (this.state.displayName) {
      this.ref.update({
        displayName: this.state.displayName
      }).then(this.exit);
    } else {
      Alert.alert(
        'Incomplete fields',
        'Please fill in all fields'
      );
    }
  }

  exit() {
    this.props.onExit
      ? this.props.onExit(): Actions.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title='Update Profile' />
        <View style={styles.content}>
          <SingleLineInput
            isBottom
            autoFocus
            autoCapitalize='words'
            onChangeText={this.onDisplayNameChange}
            value={this.state.displayName}
            label='Display Name' />
          <Button
            onPress={this.submit}
            label='Update Profile'
            color={Colors.Primary} />
        </View>
        <CloseFullscreenButton
          hide={Platform.OS !== 'ios'}
          action={this.exit} />
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
