import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Image, Alert, TouchableOpacity, Modal
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import MapView from 'react-native-maps';


export default class ContestMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        coords: {
          latitude: 43.761539,
          longitude: -79.411079,
        }
      }
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({location: position});
      },
      (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          scrollEnabled={true}
          region={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}>
          <MapView.Marker
            coordinate={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
            }}
            pinColor={Colors.Primary}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 50,
  },

  map: {
    alignSelf: 'stretch',
    height: Sizes.Height - 50
  },


});
