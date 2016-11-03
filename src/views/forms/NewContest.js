import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
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
import PricePicker from '../../components/common/PricePicker';

export default class NewContest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <DatePicker
          isTop
          isBottom
          label='Hold Contest Until'
          type='time' />
        <PricePicker
          label='Price'
          number={1}
          min={1}
          max={20}
          isBottom />
        <Button
          color={Colors.Primary}
          label='Start a new Photo Contest' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Background
  }
});
