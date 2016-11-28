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

export default class ConfirmRedeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
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
          profile: data.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.profileListener && this.profileRef.off('value', this.profileListener);
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          ref='title'
          title='Confirmation' />
        <View style={styles.content}>
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
