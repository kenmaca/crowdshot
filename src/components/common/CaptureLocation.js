import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text, TextInput
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import MapView from 'react-native-maps';
import NewContest from '../../views/forms/NewContest';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


export default class CaptureLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coord: {
        latitude: 0,
        lontitude: 0
      }
    };
  }

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          coord: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        });
      },
      (error) => console.log(JSON.stringify(error)),
        {enableHighAccuracy: false, timeout: 50000, maximumAge: 1000}
    );
  }

  render() {
   return (
     <View style={styles.container}>
       <MapView
         style={styles.map}
         region={this.state.region}>
         <MapView.Marker
           coordinate={this.state.coord}
           pinColor='red'/>
       </MapView>
      <TextInput />
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
