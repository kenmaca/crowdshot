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
import * as Firebase from 'firebase';
import Database from '../../utils/Database';

// components
import MapView from 'react-native-maps';
import ContestSummaryCard from '../../components/contestant/ContestSummaryCard';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


export default class ContestMapView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
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

    this.ref = Database.ref(
      `contests`
    );

  }

  componentDidMount() {
    let contests = [];

    this.listener = this.ref.on('value', data => {
      if (data.exists()){
        var count = 0
        Object.entries(data.val()).forEach(([key, m]) => {
          contests.push({
            index: count,
            contestId: key,
            bounty: m.bounty,
            selected: false,
            instructions: m.instructions,
            coordinate: {
            //  latitude: position.coords.latitude + 0.002,
            //  longitude: position.coords.longitude + 0.004,
            // hack before having coord data in contest
              latitude: 43.6525 + (Math.random()*2-1) / 100,
              longitude: -79.381667 + (Math.random()*2-1) / 100,
            },
          });
          count++;
        });

        contests[0].selected = true;

        this.setState({
          contests,
          data: this.state.data.cloneWithRows(contests),
        });

        this.map.fitToCoordinates(contests.map((m,i) => m.coordinate), {
          edgePadding: {top:50,right:50,bottom:50,left:50},
          animated: true,
        });
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const region = {
    //      latitude: position.coords.latitude,
    //      longitude: position.coords.longitude
    //    hack until we have coord in firebase
          latitude: 43.6525,
          longitude: -79.381667,
    //
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        this.setState({
          //    hack until we have coord in firebase
        //  currentCoord: position.coords,
          currentCoord: {
            latitude: 43.6525,
            longitude: -79.381667,
          },
          region,
          init: true
        });
      },
      (error) => console.log(JSON.stringify(error)),
        {enableHighAccuracy: false, timeout: 50000, maximumAge: 1000}
    );
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  onRegionChange= (region) => {
    this.setState({region});
  }

  onScroll = (event) => {
    let {contests, currentCoord, selected, region, markerPress} = this.state

    let index = Math.round(event.nativeEvent.contentOffset.x /
      (Sizes.Width - Sizes.OuterFrame * 2));

    if (selected != index){
      if (!markerPress){
        if (region.latitude - region.latitudeDelta/2
              > contests[index].coordinate.latitude
            || region.latitude + region.latitudeDelta/2
              < contests[index].coordinate.latitude
            || region.longitude - region.longitudeDelta/2
              > contests[index].coordinate.longitude
            || region.longitude + region.longitudeDelta/2
              < contests[index].coordinate.longitude
            || region.latitude - region.latitudeDelta/2
              > currentCoord.latitude
            || region.latitude + region.latitudeDelta/2
              < currentCoord.latitude
            || region.longitude - region.longitudeDelta/2
              > currentCoord.longitude
            || region.longitude + region.longitudeDelta/2
              < currentCoord.longitude){
          this.map.fitToCoordinates([currentCoord, contests[index].coordinate], {
            edgePadding: {top:50,right:50,bottom:50,left:50},
            animated: true,
          });
        }

        contests.forEach(contest => {
          contest.selected = false;
        });
        contests[index].selected = true;
        this.setState({contests,selected: index})
      }
    } else {
      this.setState({markerPress:false})
    }


  }

  onMarkerPress(marker){
    let index = marker.index;
    let { contests, selected } = this.state;

    if (selected != index){
      contests.forEach(contest => {
        contest.selected = false;
      });
      contests[index].selected = true;
      this.setState({contests,selected: index,markerPress:true});

      this.listview.scrollTo({
        x:(Sizes.Width - Sizes.OuterFrame * 2 + Sizes.InnerFrame / 2)*index ,
        animated:true
      });
    }
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
              initialRegion={this.state.region}
              onRegionChangeComplete={this.onRegionChange}>
              <MapView.Marker
                coordinate={currentCoord}>
                <View style={styles.ownMarker}/>
              </MapView.Marker>
              {contests.map((contest, i) => {
                const {
                  selected,
                  bounty,
                } = contest

                return (
                  <MapView.Marker
                    coordinate={contest.coordinate}
                    key={contest.index}
                    onPress={() => this.onMarkerPress(contest)}>
                    {selected ?
                    <View style={styles.markerWrapper}>
                      <View style={[styles.marker, styles.markerSelected]}>
                        <Text style={styles.selectedText}>
                          {"$" + bounty}
                        </Text>
                      </View>
                      <View style={[styles.markerArrow,styles.selectedArrow]}/>
                    </View>
                    :
                    <View style={styles.markerWrapper}>
                      <View style={styles.marker}>
                        <Text style={styles.text}>
                          {"$" + bounty}
                        </Text>
                      </View>
                      <View style={styles.markerArrow}/>
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
    marginBottom: 50 + Sizes.Height*0.25,
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
