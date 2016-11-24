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
import Icon from 'react-native-vector-icons/MaterialIcons';
import TitleBar from '../../components/common/TitleBar';
import MapView from 'react-native-maps';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Button from '../../components/common/Button';

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
      }
    };

    this.onRegionChange = this.onRegionChange.bind(this);
    this.select = this.select.bind(this);
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

  onRegionChange(region, motion) {
    this.setState({
      current: region,
      motion: motion
    });
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
