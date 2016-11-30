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
import GeoFire from 'geofire';
import {
  Actions
} from 'react-native-router-flux';

// consts
const LAT_DELTA = 0.01;
const LNG_DELTA = 0.01;
const MARKER_SIZE = 30;

// components
import Icon from 'react-native-vector-icons/MaterialIcons';
import TitleBar from '../../components/common/TitleBar';
import MapView from 'react-native-maps';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Button from '../../components/common/Button';
import ProfileRankPin from '../../components/lists/ProfileRankPin';

export default class MapMarkerDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motion: false,
      current: {

        // default location is Toronto
        latitude: 43.6525,
        longitude: -79.381667,
        latitudeDelta: LAT_DELTA,
        longitudeDelta: LNG_DELTA
      },
      profiles: {}
    };

    this.ref = new GeoFire(
      Database.ref('profileLocations')
    ).query({
      center: [
        this.state.current.latitude,
        this.state.current.longitude
      ],
      radius: GeoFire.distance(
        [this.state.current.latitude, this.state.current.longitude],
        [
          Math.min(90, Math.max(-90, this.state.current.latitude
            + this.state.current.latitudeDelta / 2)),
          Math.min(180, Math.max(-180, this.state.current.longitude
            + this.state.current.longitudeDelta / 2))
        ]
      )
    });

    this.onRegionChange = this.onRegionChange.bind(this);
    this.select = this.select.bind(this);
    this.stopMotion = this.stopMotion.bind(this);
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

    // and update when a new profile comes into view
    this.ref.on('key_entered', (profileId, location, distance) => {

      // add to seen profiles only if not self
      if (profileId !== Firebase.auth().currentUser.uid) {
        this.state.profiles[profileId] = {
          latitude: location[0],
          longitude: location[1]
        };

        // helps trigger initial load
        this.setState({
          updated: true
        });
      }
    });
  }

  select() {

    // out
    Actions.pop();

    // outer callback
    this.props.onSelected && this.props.onSelected(
      [
        this.state.current.latitude,
        this.state.current.longitude
      ]
    );
  }

  // helps avoid jitterness by delaying reappear
  stopMotion() {
    this.motion = setTimeout(
      () => this.setState({
        motion: false
      }), 50
    );
  }

  onRegionChange(region, motion) {
    this.ref.updateCriteria({
      center: [
        region.latitude,
        region.longitude
      ],
      radius: GeoFire.distance(
        [region.latitude, region.longitude],
        [
          Math.min(90, Math.max(-90, region.latitude
            + region.latitudeDelta / 2)),
          Math.min(180, Math.max(-180, region.longitude
            + region.longitudeDelta / 2))
        ]
      )
    });

    // helps avoid jitterness by delaying reappear
    this.motion && clearTimeout(this.motion);
    if (motion) this.setState({
      current: region,
      motion: true
    }); else this.stopMotion();
  }

  componentWillUnmount() {
    this.ref.cancel();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <MapView
            ref='map'
            showsUserLocation
            rotateEnabled={false}
            pitchEnabled={false}
            style={styles.map}
            region={this.state.current}
            onRegionChange={region => this.onRegionChange(
              region, true
            )}
            onRegionChangeComplete={region => this.onRegionChange(
              region, false
            )}>
            {
              Object.keys(this.state.profiles).map(profileId => {
                let markerSizes = _scaleMarker(
                  this.state.current.latitudeDelta
                );

                return (
                  <MapView.Marker
                    key={profileId}
                    coordinate={this.state.profiles[profileId]}>
                    <ProfileRankPin
                      profileId={profileId}
                      innerSize={markerSizes.inner}
                      outerSize={markerSizes.outer} />
                  </MapView.Marker>
                );
              })
            }
            <View style={styles.pinShadow}>
              <View style={styles.pinContainer}>
                <TouchableOpacity
                  onPress={this.select}
                  style={styles.pinContent}>
                  <Icon
                    name='flag'
                    color={Colors.AlternateText}
                    size={48} />
                </TouchableOpacity>
              </View>
            </View>
            <TitleBar
              title='Select the Contest Location'
              style={[
                styles.titleContainer,
                this.state.motion && {
                  height: 0,
                  padding: 0,
                  paddingTop: 0
                }
              ]} />
            <View style={styles.buttonContainer}>
              <Button
                onPress={this.select}
                style={
                  this.state.motion && {
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    height: 0
                  }
                }
                squareBorders
                color={Colors.Primary}
                label='Set Location' />
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

  content: {
    flex: 1
  },

  map: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  pinContainer: {
    top: -Sizes.InnerFrame / 2.3,
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
    left: Sizes.InnerFrame / 1.2
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
  },

  titleContainer: {
    width: Sizes.Width,
    position: 'absolute',
    top: 0
  },

  buttonContainer: {
    width: Sizes.Width,
    padding: Sizes.InnerFrame,
    position: 'absolute',
    bottom: 0
  }
});

// scale markers with min and max sizes as pinch to zoom
function _scaleMarker(delta) {
  return {
    outer: Math.max(
      MARKER_SIZE / 2,
      Math.min(
        MARKER_SIZE,
        MARKER_SIZE / delta * LAT_DELTA
      )
    ), inner: Math.max(
      (MARKER_SIZE - 8) / 2,
      Math.min(
        (MARKER_SIZE - 8),
        (MARKER_SIZE - 8) / delta * LAT_DELTA
      )
    )
  };
}
