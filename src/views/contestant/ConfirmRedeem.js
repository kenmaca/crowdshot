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

  entryContainer: {
    margin: Sizes.InnerFrame / 2,
    marginBottom: 0,
  }
});
