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
import PricePicker from '../../components/common/PricePicker';
import Capture from './Capture';
import Location from './Location';
import PriceSelect from '../../components/common/PriceSelect';
import Payment from '../../components/common/Payment';

export default class NewContest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.location}>
            <Location
              label='Location'
              isTop
              />
          </View>
          <View style={styles.capture}>
            <Capture />
          </View>
        </View>
        <View style={styles.button}>
          <Button
            color={Colors.Primary}
            onPress={() => Actions.modal({
              view: <Payment />
            })}
            label='Start a new Photo Contest'
            squareBorders={10}
            style={styles.buttonStyle} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },
  main: {
    flex: 1,
    width: Sizes.width
  },
  capture: {
    flex: 1,
    paddingTop: 200,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  button: {
    marginBottom: Sizes.H3
  },
  buttonStyle: {
    paddingBottom: Sizes.H3 + 20,
    height: Sizes.H3 + 50,
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch'
  },
  location: {
    marginTop: 20
  }
});
