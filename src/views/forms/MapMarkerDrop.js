import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// consts
const LAT_DELTA = 0.01;
const LONG_DELTA = 0.01;

// components
import MapView from 'react-native-maps';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';

export default class MapMarkerDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {

        // default location is Toronto
        latitude: 43.6525,
        longitude: -79.381667,
        latitudeDelta: LAT_DELTA,
        longitudeDelta: LONG_DELTA
      }
    };

    this.onRegionChange = this.onRegionChange.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => this.setState({
        current: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LAT_DELTA,
          longitudeDelta: LONG_DELTA
        }
      })
    );
  }

  onRegionChange(region) {
    this.setState({
      current: region
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Select the Contest Location
          </Text>
        </View>
        <View style={styles.content}>
          <MapView
            ref='map'
            style={styles.map}
            region={this.state.current}
            onRegionChange={this.onRegionChange}>
            <MapView.Marker
              coordinate={this.state.current} />
          </MapView>
        </View>
        <CloseFullscreenButton />
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {

            // outer callback
            this.props.onSelected && this.props.onSelected(
              this.state.current
            );

            // and out
            Actions.pop();
          }}>
          <View style={styles.doneButtonShadow}>
            <Text style={styles.doneButtonText}>
              Done
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  titleContainer:{
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Sizes.InnerFrame,
    height: Sizes.NavHeight,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H3
  },

  content: {
    flex: 1
  },

  map: {
    flex: 1
  },

  doneButton: {
    top: Sizes.InnerFrame,
    right: 0,
    position: 'absolute',
    padding: Sizes.InnerFrame
  },

  doneButtonShadow: {
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },

  doneButtonText: {
    color: Colors.Text,
    fontSize: Sizes.H3,
    fontWeight: '500'
  }
});
