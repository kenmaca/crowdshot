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
const LNG_DELTA = 0.01;

// components
import MapView from 'react-native-maps';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import OutlineText from '../../components/common/OutlineText';

export default class MapMarkerDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {

        // default location is Toronto
        latitude: 43.6525,
        longitude: -79.381667,
        latitudeDelta: LAT_DELTA,
        longitudeDelta: LNG_DELTA
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
          longitudeDelta: LNG_DELTA
        }
      }),
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
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
            <View style={styles.pinShadow}>
              <View style={styles.pinContainer}>
                <TouchableOpacity
                  onPress={() => {

                    // outer callback
                    this.props.onSelected && this.props.onSelected(
                      [
                        this.state.current.latitude,
                        this.state.current.longitude
                      ]
                    );

                    // and out
                    Actions.pop();
                  }}
                  style={styles.pinContent}>
                  <OutlineText text='Set as Contest Location' />
                </TouchableOpacity>
                <View style={styles.pin} />
              </View>
            </View>
          </MapView>
        </View>
        <CloseFullscreenButton />
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  pinContainer: {
    top: -Sizes.InnerFrame * 1.2,
    alignItems: 'center'
  },

  pin: {
    top: -Sizes.InnerFrame / 4,
    zIndex: -100,
    width: Sizes.InnerFrame / 2,
    height: Sizes.InnerFrame / 2,
    backgroundColor: Colors.Foreground,
    transform: [
      {
        rotate: '45deg'
      }
    ]
  },

  pinContent: {
    minWidth: Sizes.InnerFrame * 10,
    padding: Sizes.InnerFrame / 2,
    backgroundColor: Colors.Foreground,
    borderRadius: 20,
    overflow: 'hidden'
  },

  pinShadow: {
    backgroundColor: Colors.Transparent,
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: Sizes.InnerFrame / 2,
      width: 0
    }
  }
});
