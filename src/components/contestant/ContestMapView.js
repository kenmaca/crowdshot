import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text, Animated, PanResponder,
  ListView
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import MapView from 'react-native-maps';
import PanController from '../common/PanController';
import ContestCard from '../../components/lists/ContestCard';


let AnimatedListView = Animated.createAnimatedComponent(
  ListView
);

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;
const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = Sizes.Width - (2 * ITEM_SPACING) - (2 * ITEM_PREVIEW);
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;


export default class ContestMapView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      currentCoord:{
        latitude: 0,
        longitude: 0,
      },
      region: new MapView.AnimatedRegion({
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      contests: [],
      data: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };

  }

  componentDidMount() {
    let contests = [];

    navigator.geolocation.getCurrentPosition(
      (position) => {
        contests.push({
          id: 0,
          contestId: 'testContest',
          amount: 5,
          coordinate: {
            latitude: position.coords.latitude + 0.002,
            longitude: position.coords.longitude + 0.004,
          },
          description: "Contest 1"
        });
        contests.push({
          id: 1,
          contestId: 'testContest',
          amount: 10,
          coordinate: {
            latitude: position.coords.latitude - 0.002,
            longitude: position.coords.longitude + 0.002,
          },
          description: "Contest 2"
        });
        contests.push({
          id: 2,
          contestId: 'testContest',
          amount: 15,
          coordinate: {
            latitude: position.coords.latitude + 0.003,
            longitude: position.coords.longitude + 0.001,
          },
          description: "Contest 3"
        });

        const region = new MapView.AnimatedRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });

        this.setState({
          currentCoord: position.coords,
          contests,
          region,
          data: this.state.data.cloneWithRows(contests),
          init: true
        });
      },
      (error) => console.log(JSON.stringify(error)),
        {enableHighAccuracy: false, timeout: 50000, maximumAge: 1000}
    );
  }



  render() {
    const {
      contests,
      region,
      currentCoord,
    } = this.state;

   return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <AnimatedListView
            horizontal
            pagingEnabled
            removeClippedSubviews={false}
            dataSource={this.state.data}
            contentContainerStyle={styles.lists}
            renderRow={
              (rowData, s, i) => {
                return (
                  <View
                    key={i}
                    style={styles.cardShadow}>
                    <ContestCard contestId={rowData.contestId} />
                  </View>
                );
              }
            } />
          <View style={styles.mapContainer}>
            <MapView.Animated
              style={styles.map}
              region={this.state.region}>
              <MapView.Marker
                coordinate={currentCoord}
                pinColor={Colors.Primary}
              />
              {contests.map((contest, i) => {
                return (
                  <MapView.Marker
                    coordinate={contest.coordinate}
                    image={require('../../../res/img/camera.png')}
                    key={contest.id}
                  />
                );
              })}
            </MapView.Animated>
            {this.state.init ||
            <View style={styles.buttonContainer}>
              <View style={styles.bubble}>
                <Text style={styles.text}>Loading</Text>
              </View>
            </View>
            }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignSelf: 'stretch',
  },

  container: {
    flex: 1,
    alignSelf: 'stretch',
  },

  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    marginBottom: 50 + 150,
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
  },

  lists: {
    alignSelf: 'flex-end',
    height: 150,
    marginBottom: 50,
  },

  cardShadow: {
    height: 150,
    borderRadius: 5,
    marginTop: Sizes.InnerFrame / 4,
    marginLeft: Sizes.InnerFrame / 4,
    marginRight: Sizes.InnerFrame / 4,
    shadowColor: Colors.DarkOverlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 0
    }
  },

});
