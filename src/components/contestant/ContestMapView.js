import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text, Animated, PanResponder,
  ListView, TouchableOpacity, Alert
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import * as Firebase from 'firebase';
import GeoFire from 'geofire';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import MapView from 'react-native-maps';
import ContestMapCard from '../lists/ContestMapCard';

const LAT_DELTA = 0.01;
const LNG_DELTA = 0.01;

export default class ContestMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {

        // default location is Toronto
        latitude: 43.6525,
        longitude: -79.381667,
        latitudeDelta: LAT_DELTA,
        longitudeDelta: LNG_DELTA,
      },
      contests: {},
      inView: {},
      data: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
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
          this.state.region.latitude
            + this.state.region.latitudeDelta / 2,
          this.state.region.longitude
            + this.state.region.longitudeDelta / 2
        ]
      )
    });

    // methods
    this.onRegionChange = this.onRegionChange.bind(this);
    this.rebuild = this.rebuild.bind(this);
  }

  onRegionChange(region) {
    this.ref.updateCriteria({
      center: [
        region.latitude,
        region.longitude
      ],
      radius: GeoFire.distance(
        [region.latitude, region.longitude],
        [
          region.latitude + region.latitudeDelta / 2,
          region.longitude + region.longitudeDelta / 2
        ]
      )
    });

    this.setState({
      region: region
    });
  }

  rebuild() {
    this.setState({
      data: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(Object.keys(this.state.inView))
    });
  }

  componentDidMount() {

    // setup default location
    navigator.geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta
        };
        this.setState({
          current: region,
          region: region
        });

        // trigger initial load
        this.onRegionChange(region);
      },
      error => Alert.alert(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );

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

      this.rebuild();
    });

    // remove when out of view
    this.ref.on('key_exited', (key, location, distance) => {
      delete this.state.inView[key];
      this.rebuild();
    });
  }

  componentWillUnmount() {
    this.ref.cancel();
  }

  renderRow(contestId) {
    return (
      <TouchableOpacity
        onPress={() => Actions.contestDetail({
          contestId: contestId
        })}>
        <ContestMapCard contestId={contestId} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <MapView
            ref='map'
            style={styles.map}
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChange}>
            {
              Object.keys(this.state.contests).map((contest, i) => {
                return (
                  <MapView.Marker
                    coordinate={this.state.contests[contest].location}
                    key={contest}
                    onPress={null}>
                    <View style={styles.markerWrapper}>
                      <View style={[styles.marker, styles.markerSelected]}>
                        <Text style={styles.selectedText}>
                          $10
                        </Text>
                      </View>
                      <View style={[styles.markerArrow,styles.selectedArrow]}/>
                    </View>
                  </MapView.Marker>
                );
              })
            }
            <View style={styles.listContainer}>
              <ListView
                ref='list'
                horizontal
                enableEmptySections
                renderSeparator={() => (
                  <View
                    key={Math.random()}
                    style={styles.separator} />
                )}
                contentContainerStyle={styles.listContent}
                dataSource={this.state.data}
                renderRow={this.renderRow} />
            </View>
          </MapView>
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

  listContainer: {
    height: 200,
    marginBottom: Sizes.OuterFrame * 2,
    alignSelf: 'stretch',
    backgroundColor: Colors.Transparent,
    overflow: 'hidden'
  },

  listContent: {
    paddingLeft: Sizes.InnerFrame
  },

  separator: {
    marginRight: Sizes.InnerFrame / 4
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
  },

  selectedText: {
    color: Colors.Text,
    fontWeight: '800',
    fontSize: Sizes.H4
  },


  markerWrapper: {
    alignItems: 'center'
  },

  marker: {
    borderRadius: 5,
    borderWidth: 0,
    paddingHorizontal: 3,
    backgroundColor: Colors.MediumDarkOverlay,
  },

  markerSelected: {
    backgroundColor: Colors.Primary,
  },

  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: Colors.Transparent,
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderLeftColor: Colors.Transparent,
    borderRightColor: Colors.Transparent,
    borderTopColor: Colors.MediumDarkOverlay
  },

  selectedArrow: {
    borderTopColor: Colors.Primary
  },

  ownMarker: {
    width: 20,
    height: 20,
    borderRadius: 20/2,
    backgroundColor: Colors.Primary,
    borderColor: Colors.ModalBackground,
    borderWidth: 3,
    shadowColor: Colors.DarkOverlay,
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
  }



});
