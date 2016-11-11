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
import ContestSummaryCard from '../../components/contestant/ContestSummaryCard';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


export default class ContestMapView extends Component {
  constructor(props) {
    super(props);


    this.state = {
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
        contests.push({
          id: 3,
          contestId: 'testContest',
          amount: 15,
          selected: false,
          coordinate: {
            latitude: position.coords.latitude + 0.0035,
            longitude: position.coords.longitude - 0.001,
          },
          description: "Contest 4"
        });
        contests.push({
          id: 4,
          contestId: 'testContest',
          amount: 15,
          selected: false,
          coordinate: {
            latitude: position.coords.latitude - 0.004,
            longitude: position.coords.longitude + 0.001,
          },
          description: "Contest 5"
        });
        contests.push({
          id: 5,
          contestId: 'testContest',
          amount: 15,
          selected: false,
          coordinate: {
            latitude: position.coords.latitude + 0.002,
            longitude: position.coords.longitude + 0.0015,
          },
          description: "Contest 6"
        });

        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        contests[0].selected = true;

        this.setState({
          currentCoord: position.coords,
          contests,
          region,
          data: this.state.data.cloneWithRows(contests),
          init: true
        });

        this.map.fitToCoordinates(contests.map((m,i) => m.coordinate), {
          edgePadding: {top:50,right:50,bottom:50,left:50},
          animated: true,
        });
      },
      (error) => console.log(JSON.stringify(error)),
        {enableHighAccuracy: false, timeout: 50000, maximumAge: 1000}
    );
  }

  onScroll = (event) => {
    let {contests, currentCoord} = this.state

    let index = Math.round(event.nativeEvent.contentOffset.x /
      (Sizes.Width - Sizes.OuterFrame * 2));

    this.map.fitToCoordinates([currentCoord, contests[index].coordinate], {
      edgePadding: {top:50,right:50,bottom:50,left:50},
      animated: true,
    });

  //  console.log("getoffset ", this.listview.scrollProperties.offset);

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
            ref={ref => {this.listview = ref;}}
            horizontal
          //  pagingEnabled
          //  pageSize={3}
            removeClippedSubviews={true}
            dataSource={this.state.data}
        //    style={this.getListViewStyle()}
            contentContainerStyle={styles.lists}
            onScroll={this.onScroll}
            renderRow={
              (rowData, s, i) => {
                return (
                  <View
                    key={i}>
                    <ContestSummaryCard contest={rowData} />
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
                const {
                  selected,
                  amount,
                } = contest

                return (
                  <MapView.Marker
                    coordinate={contest.coordinate}
                    key={contest.id}>
                    {selected ?
                    <View style={[styles.markerWrapper, styles.markerSelected]}>
                      <Text style={styles.selectedText}>
                        {"$" + amount}
                      </Text>
                    </View>
                    :
                    <View style={styles.markerWrapper}>
                      <Text style={styles.text}>
                        {"$" + amount}
                      </Text>
                    </View>
                    }
                  </MapView.Marker>
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
    backgroundColor: Colors.Background,
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

  selectedText: {
    color: Colors.Text,
    fontWeight: '800',
    fontSize: Sizes.H4
  },

  lists: {
    alignSelf: 'flex-end',
    marginBottom: 50,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },

  markerWrapper: {
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 3,
    borderColor: Colors.DarkOverlay,
    backgroundColor: Colors.MediumDarkOverlay,
  },

  markerSelected: {
    borderColor: Colors.Primary,
    backgroundColor: Colors.SubduedText,
  },




});
