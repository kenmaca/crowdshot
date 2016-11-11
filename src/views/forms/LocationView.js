import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

import ContestMapView from '../../components/contestant/ContestMapView';

export default class LocationView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ContestMapView/>
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
