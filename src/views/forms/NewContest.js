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
import Payment from '../../components/common/Payment';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class NewContest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.location}>
            <Location placeholder={
                <Icon
                  name='pin-drop'
                  size={18}
                  color={Colors.Primary}/>
              }/>
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
            label='Start a new Contest'
            squareBorders={10}
            style={styles.buttonStyle}>
          </Button>
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
