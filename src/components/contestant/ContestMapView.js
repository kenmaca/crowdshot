import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Image, Alert, TouchableOpacity, Modal, Text
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
          latitude: 0,
          longitude: 0,
        }
      },
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        let contestList = [];
        contestList.push({
          location: {
            latitude: position.coords.latitude + 0.002,
            longitude: position.coords.longitude + 0.004,
          },
          description: "Contest 1"
        });
        contestList.push({
          location: {
            latitude: position.coords.latitude - 0.002,
            longitude: position.coords.longitude + 0.002,
          },
          description: "Contest 2"
        });
        contestList.push({
          location: {
            latitude: position.coords.latitude + 0.003,
            longitude: position.coords.longitude + 0.001,
          },
          description: "Contest 3"
        });


        this.setState({
          location: position,
          contestList: contestList,
          init: true
        });
      },
      (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    navigator.geolocation.watchPosition((position) => {
      this.setState({
        location: position,
        init: true
      });
    });
  }

  render() {
    let markerList = [];
    let count = 0;
    if (this.state.contestList){
      this.state.contestList.forEach(contest => {
          markerList.push(
            <MapView.Marker
              coordinate={{
                latitude: contest.location.latitude,
                longitude: contest.location.longitude,
              }}
              image={require('../../../res/img/camera.png')}
              key={count}
            />
          );
          count++;
      });
    }
    console.log("markerList, ", markerList);


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
          {this.state.init &&
          <MapView.Marker
            coordinate={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
            }}
            pinColor={Colors.Primary}
          />
          }
          {markerList}
        </MapView>
        {this.state.init ||
        <View style={styles.buttonContainer}>
          <View style={styles.bubble}>
            <Text style={styles.text}>Loading</Text>
          </View>
        </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginBottom: 50,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  bubble: {
    backgroundColor: Colors.Overlay,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 15,
  },

  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },

  text: {
    color: Colors.Text,
    fontWeight: '600'
  }

});
