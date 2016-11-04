import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

import Field from '../../components/common/Field';
import LocationView from './LocationView';


export default class Location extends Component {
  render() {
    return (
      <Field {...this.props}>
        <View style={styles.container}>
          <View style={styles.arrowContainer}>
            <TouchableOpacity
              onPress={() => Actions.modal({
                view: <LocationView />
              })}>
              <Text style={styles.text}>
                >
              </Text>
            </TouchableOpacity>
          </View>
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
    color: Colors.Text,
    textAlign: 'right'
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    paddingRight: Sizes.OuterFrame
  }
});
