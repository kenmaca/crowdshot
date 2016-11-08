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
          <Capture
            label='Capture'
            isBottom />
          <Location
            label='Location'
            isBottom />
          <PriceSelect
            isBottom />
        </View>
        <View style={styles.button}>
          <Button
            color={Colors.Primary}
            onPress={() => Actions.modal({
              view: <Payment
                      type={'visa'}
                      focused={'name'}

                      expiry={1111}
                      cvc={999}
                      name={'RoyLaw'}/>
            })}
            label='Start a new Photo Contest'
            squareBorders={9}
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginBottom: 50,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    alignSelf: 'stretch'
  },
  buttonStyle: {
    width: Sizes.width,
    height: 30
  }
});
