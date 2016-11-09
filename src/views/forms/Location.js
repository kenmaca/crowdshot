import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Field from '../../components/common/Field';
import CaptureLocation from '../../components/common/CaptureLocation'
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Location extends Component {
  render() {
    return (
      <Field {...this.props}
        color={Colors.Background}>
        <View style={styles.container}>
            <TouchableOpacity
              onPress={() => Actions.modal({
                view: <CaptureLocation />
              })}>
              <View style={styles.locationContainer}>
                <Text style={styles.text}>
                  Current Location
                </Text>
              </View>
            </TouchableOpacity>
        </View>
      </Field>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: Sizes.Text,
    color: Colors.Location,
    textAlign: 'right'
  },
  locationContainer: {
    backgroundColor: Colors.Transparent,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingRight: Sizes.InnerFrame
  }
});
