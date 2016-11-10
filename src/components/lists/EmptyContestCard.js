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

// components
import CircleIcon from '../common/CircleIcon';
import Button from '../common/Button';

export default class EmptyContestCard extends Component {
  render() {
    return (
      <View style={styles.container}>
        <CircleIcon
          icon='flag'
          size={48} />
        <Text style={styles.title}>
          Get amazing photos
        </Text>
        <Text style={styles.description}>
          Crowdshot taps into the millions of cameras constantly
          roaming across the planet. Let other people
          get that perfect shot.
        </Text>
        <Text style={styles.description}>
          You only pay for the best.
        </Text>
        <Button
          style={styles.button}
          onPress={Actions.mainBroadcast}
          color={Colors.Primary}
          rightIcon='arrow-forward'
          label='Get started now' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Sizes.Width - Sizes.InnerFrame / 2,
    padding: Sizes.InnerFrame,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.Background
  },

  title: {
    marginTop: Sizes.InnerFrame,
    textAlign: 'center',
    color: Colors.Text,
    fontSize: Sizes.H1,
    fontWeight: '100'
  },

  description: {
    marginTop: Sizes.InnerFrame,
    textAlign: 'center',
    color: Colors.Text,
    fontSize: Sizes.H2,
    fontWeight: '100'
  },

  button: {
    marginTop: Sizes.OuterFrame
  }
});
