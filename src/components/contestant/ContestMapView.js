import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text, Animated, PanResponder,
  TouchableOpacity, Alert, DeviceEventEmitter, Platform
} from 'react-native';
import {
  Sizes, Colors, Styles
} from '../../Const';
import * as Firebase from 'firebase';
import GeoFire from 'geofire';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';
import Geocoder from 'react-native-geocoder';
import RNGLocation from 'react-native-google-location';

// components
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import ContestMapMarker from './ContestMapMarker';
import HeaderButtons from '../common/HeaderButtons';
import HeaderButton from '../common/HeaderButton';

const LAT_DELTA = 0.01;
const LNG_DELTA = 0.01;

export default class ContestMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      region: {

        // default location is Toronto
        latitude: 43.6525,
        longitude: -79.381667,
        latitudeDelta: LAT_DELTA,
        longitudeDelta: LNG_DELTA,
      },
      contests: {},
      inView: {},
      wallet: 0,
    };

    this.ref = new GeoFire(
      Database.ref('locations')
    ).query({
      center: [
        this.state.region.latitude,
        this.state.region.longitude
      ],
      radius: GeoFire.distance(
        [this.state.region.latitude, this.state.region.longitude],
        [
          Math.min(90, Math.max(-90, this.state.region.latitude
            + this.state.region.latitudeDelta / 2)),
          Math.min(180, Math.max(-180, this.state.region.longitude
            + this.state.region.longitudeDelta / 2))
        ]
      )
    });

    this.profileRef = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }`
    );

    this.billingRef = Database.ref(
      `billing/${
        Firebase.auth().currentUser.uid
      }`
    );

    // methods
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  onLocationChange (e: Event) {
    let region = {
      latitude: e.Latitude,
      longitude: e.Longitude,
      latitudeDelta: this.state.region.latitudeDelta,
      longitudeDelta: this.state.region.longitudeDelta
    };

    // trigger initial load
    this.onRegionChange(region, true);

    // update server about contestant whereabouts
    new GeoFire(Database.ref('profileLocations')).set(
      Firebase.auth().currentUser.uid,
      [e.Latitude, e.Longitude]
    );

    this.evEmitter.remove();
  }

  onRegionChange(region, initial) {
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

    // only geocode if this is the first time we found
    // a location
    if (initial && !this.state.geocoded) {

      // add geocoded info to profile to show current city
      let coords = {
        lat: region.latitude,
        lng: region.longitude
      };

      Geocoder.geocodePosition(coords).then(location => {
        if (location[0]) {
          Database.ref(
            `profiles/${
              Firebase.auth().currentUser.uid
            }/currentRegion`
          ).set(
            [
              location[0].locality, location[0].adminArea
            ].filter(l => l).join(', ') || 'Unknown'
          );
          Database.ref(
            `profiles/${
              Firebase.auth().currentUser.uid
            }/currentCountry`
          ).set(location[0].country || 'Unknown');
        }
      }).catch(err => console.log(err));
    }

    this.setState({
      region: region,
      geocoded: this.state.geocoded || initial
    });
  }

  componentDidMount() {

    // setup default location
    if (Platform.OS === 'ios') {
      this.position = navigator.geolocation.watchPosition(
        position => {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta
          };

          // trigger initial load
          this.onRegionChange(region, true);

          // update server about contestant whereabouts
          new GeoFire(Database.ref('profileLocations')).set(
            Firebase.auth().currentUser.uid,
            [position.coords.latitude, position.coords.longitude]
          );
        },
        error => Alert.alert(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        }
      );
    } else {
      if (!this.evEmitter) {
        // Register Listener Callback - has to be removed later
        this.evEmitter = DeviceEventEmitter.addListener('updateLocation', this.onLocationChange.bind(this));
        // Initialize RNGLocation
        RNGLocation.getLocation();
      }
    }

    // and update when a new contest comes into view
    this.ref.on('key_entered', (key, location, distance) => {

      // add to in view
      this.state.inView[key] = true;
      this.state.contests[key] = {
        location: {
          latitude: location[0],
          longitude: location[1]
        },
        distance: distance
      };
    });

    // remove when out of view
    this.ref.on('key_exited', (key, location, distance) => {
      delete this.state.inView[key];
    });

    // for HeaderButtons
    this.profileListener = this.profileRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          profile: data.val()
        });
      }
    });

    this.billingListener = this.billingRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          wallet: -1/100 * Object.values(
            data.val().transactions || {}
          ).reduce((a, b) => a + b, 0)
        });
      }
    });


  }

  componentWillUnmount() {
    this.position && navigator.geolocation.clearWatch(this.position);
    this.ref.cancel();
    this.profileListener && this.profileRef.off('value', this.profileListener);
    this.billingListener && this.billingRef.off('value', this.billingListener);

    this.evEmitter.remove();
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <MapView
            ref='map'
            showsUserLocation
            showsMyLocationButton={false}
            rotateEnabled={false}
            pitchEnabled={false}
            provider={MapView.PROVIDER_GOOGLE}
            customMapStyle={Styles.MapStyle}
            style={styles.map}
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChange}>
            {
              Object.keys(this.state.contests).map((contest, i) => {
                return (
                  <ContestMapMarker
                    coordinate={this.state.contests[contest].location}
                    contestId={contest}
                    key={contest} />
                );
              })
            }
          </MapView>
          <HeaderButtons>
            <HeaderButton
              icon='gavel'
              onPress={Actions.entries}
              unread={
                this.state.profile.entries
                && Object.keys(this.state.profile.entries).length
                || 0
              } />
            <TouchableOpacity style={styles.winningsContainer}
              onPress={Actions.redeem}>
              <FontAwesomeIcon
                name='trophy'
                color={Colors.Text} />
              <Text style={styles.winnings}>
                {
                  `$${
                    this.state.wallet.toFixed(0)
                    || 0
                  }`
                }
              </Text>
            </TouchableOpacity>
          </HeaderButtons>
          {
            (
              Object.keys(this.state.inView).length > 0
            ) ? (
              <View />
            ): (
              <View style={styles.overlay}>
                <View style={[styles.shadow, styles.textContainer]}>
                  <Text style={styles.text}>
                    No active contests found — try moving the map around
                  </Text>
                </View>
              </View>
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.Background,
  },

  container: {
    flex: 1,
    alignSelf: 'stretch',
  },

  map: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  overlay: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: Colors.Transparent,
    width: Sizes.Width,
    alignItems: 'center',
  },

  shadow: {
    backgroundColor: Colors.Transparent,
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: Sizes.InnerFrame / 2,
      width: 0
    }
  },

  textContainer: {
    marginBottom: Sizes.OuterFrame * 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.InnerFrame * 2,
    paddingTop: Sizes.InnerFrame / 2,
    paddingBottom: Sizes.InnerFrame / 2,
    backgroundColor: Colors.Black,
    borderRadius: 18
  },

  text: {
    color: Colors.Text,
    fontSize: Sizes.Text
  },

  winningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.InnerFrame / 2,
    marginLeft: Sizes.InnerFrame,
    backgroundColor: Colors.Primary,
    borderRadius: 14
  },

  winnings: {
    marginLeft: Sizes.InnerFrame / 4,
    fontWeight: '700',
    color: Colors.Text
  }
});
