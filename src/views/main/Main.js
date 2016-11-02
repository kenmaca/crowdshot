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
  Colors
} from '../../Const';

// components
import Field from '../../components/common/Field';

export default class Main extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Field
          isTop
          label='A special message'
          subtitle='This is a very special one.'>
          <Text>
            Hi there.
          </Text>
        </Field>
        <Field
          label='Another one'>
          <Text>
            Hi there.
          </Text>
        </Field>
        <Field
          isBottom
          label='And a final message'
          subtitle='No more, I promise.'>
          <Text>
            Hi there.
          </Text>
        </Field>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background
  }
});
