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
import ContestCard from '../../components/lists/ContestCard';


const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


export default class ContestMapView extends Component {
  constructor(props) {
    super(props);

    const panX = new Animated.Value(0);
    const panY = new Animated.Value(0);

    const scrollY = panY.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scrollX = panX.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    this.state = {
      index: 0,
      panX,
      panY,
      scrollX,
      scrollY,
      currentCoord:{
        latitude: 0,
        longitude: 0,
      },
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
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
          selected: false,
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
          selected: false,
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
          selected: false,
          coordinate: {
            latitude: position.coords.latitude + 0.003,
            longitude: position.coords.longitude + 0.001,
          },
          description: "Contest 3"
        });

        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

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

  onChangeVisibleRows = (visibleRows, changedRows) => {
    let {contests, currentCoord} = this.state

    let index = Object.keys(visibleRows.s1)[0];
  //  console.log("visibleRows ",index);
    console.log("selected contest ", contests[index].description);
    this.map.fitToCoordinates([currentCoord, contests[index].coordinate], {
      edgePadding: {top:50,right:50,bottom:50,left:50},
      animated: true,
    });

    contests.forEach(contest => {
      contest.selected = false;
    });
    contests[index].selected = true;
    this.setState({contests})

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
          <ListView
            horizontal
            pagingEnabled
            removeClippedSubviews={false}
            dataSource={this.state.data}
            contentContainerStyle={styles.lists}
            onChangeVisibleRows={this.onChangeVisibleRows}
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
            <MapView
              ref={ref => {this.map = ref;}}
              style={styles.map}
              initialRegion={this.state.region}>
              <MapView.Marker
                coordinate={currentCoord}
                pinColor={Colors.Primary}
              />
              {contests.map((contest, i) => {
                return (
                  <MapView.Marker
                    coordinate={contest.coordinate}
                    pinColor='red'
                    key={contest.id}
                  />
                );
              })}
            </MapView>
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
