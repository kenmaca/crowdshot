import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

export default class LocationView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.locationContainer}>
          <Text style={styles.text}>
            Location
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    backgroundColor: Colors.Background
  },

  locationContainer: {
  },

  text: {
    fontSize: Sizes.Text,
    color: Colors.Text,
    textAlign: 'center'
  }
});
