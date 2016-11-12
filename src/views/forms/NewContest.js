import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Image
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Sizes
} from '../../Const';

// components
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';
import Capture from './Capture';
import Location from './Location';
import Bounty from './Bounty';
import Payment from '../../components/common/Payment';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class NewContest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Ok! Let's Setup Your Contest Now!
          </Text>
        </View>
        <View style={styles.checklist}>
          <Location
            label='Location'
            subtitle='Where the contest will be hold'
            isBottom/>
          <Capture
            fontAwesome
            label='Reference Photo'
            subtitle='Provide a reference photo for us'
            isBottom/>
          <Bounty
            label='Bounty'
            subtitle='Reward the Winner for their effort'
            isBottom/>
        </View>
        <Button
          color={Colors.Primary}
          onPress={() => Actions.modal({
            view: <Payment />
          })}
          label='Start a new Photo Contest'
          squareBorders={10}
          style={styles.buttonStyle}>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    marginBottom: 50
  },
  header: {
    marginTop: 50,
    height: 50,
    paddingLeft: Sizes.OuterFrame,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  headerText: {
    color: Colors.Text,
    fontWeight: '700',
    fontSize: Sizes.H3,
    textAlign: 'left'
  },
  checklist: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Sizes.OuterFrame
  },
  buttonStyle: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch'
  }
});
