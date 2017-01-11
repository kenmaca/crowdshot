import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Platform, Image, Alert, BackAndroid, StatusBar
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import GeoFire from 'geofire';
import Geocoder from 'react-native-geocoder';
import {
  Actions
} from 'react-native-router-flux';

// components
import * as Animatable from 'react-native-animatable';

// const
const DEFAULT_INSTRUCTIONS = '';
let AnimatedImage = Animatable.createAnimatableComponent(Image);

export default class NewContestContainer extends Component {
  constructor(props) {
    super(props);
    Platform.OS !== 'ios'
      && StatusBar.setBackgroundColor(Colors.Primary, false);
    this.state = {
      prizeId: null,
      location: null,
      referencePhotoId: null,
      processing: false,
      instructions: null
    };

    // methods
    this.submit = this.submit.bind(this);
    this.routing = this.routing.bind(this);
  }

  routing() {
    Platform.OS !== 'ios'
      && StatusBar.setBackgroundColor(Colors.Background, false);
    if (!this.state.referencePhotoId) {
      Actions.newReferencePhoto({
        onTaken: photoId => {
          StatusBar.setHidden(false, 'slide');
          Platform.OS !== 'ios'
            && StatusBar.setBackgroundColor(Colors.Primary, false);
          this.setState({
            referencePhotoId: photoId,
            halt: false
          })
        },
        panHandlers: null,
        closeAction: () => {
          StatusBar.setHidden(false, 'slide');
          Actions.pop({
            popNum: 2
          })
        }
      });
    } else if (!this.state.instructions) {
      Actions.textEntry({
        onSubmit: text => {
          Platform.OS !== 'ios'
            && StatusBar.setBackgroundColor(Colors.Primary, false);
          this.setState({
            instructions: text,
            halt: false
          });
        },
        title: 'Contest Instructions',
        label: 'Instructions',
        subtitle: 'General rules for your contest',
        buttonLabel: 'Add Instructions',
        value: DEFAULT_INSTRUCTIONS,
        panHandlers: null,
        closeAction: () => Actions.pop({
          popNum: 2
        })
      });
    } else if (!this.state.location) {
      Actions.mapMarkerDrop({
        onSelected: location => {
          Platform.OS !== 'ios'
            && StatusBar.setBackgroundColor(Colors.Primary, false);
          this.setState({
            location: location,
            halt: false
          })
        },
        panHandlers: null,
        closeAction: () => Actions.pop({
          popNum: 2
        })
      });
    } else if (!this.state.prizeId) {
      Actions.newPayment({
        onCharged: transactionId => {
          Platform.OS !== 'ios'
            && StatusBar.setBackgroundColor(Colors.Primary, false);
          this.setState({
            prizeId: transactionId,
            halt: false
          })
        },
        panHandlers: null,
        description: 'Bounty for Photo Contest',
        closeAction: () => Actions.pop({
          popNum: 2
        })
      });
    } else {
      this.submit();
    }
  }

  componentDidMount() {
    // allow full exit
    this.back = () => {
      Actions.pop({
        popNum: 2
      });
      return true;
    };
    BackAndroid.addEventListener('hardwareBackPress', this.back);
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    if (!this.state.halt) {

      // prevent other routing from opening more windows
      this.state.halt = true;
      this.delay = setTimeout(this.routing, 500);
    }
  }

  componentWillUnmount() {

    // reset back to normal
    this.back && BackAndroid.removeEventListener('hardwareBackPress', this.back);
    this.delay && clearTimeout(this.delay);
  }

  render() {
    return (
      <View style={styles.container}>
        <AnimatedImage
          ref='logo'
          animation='bounce'
          iterationCount='infinite'
          source={require('../../../res/img/logo.png')}
          style={styles.logo} />
      </View>
    );
  }

  submit() {

    // block view as we setup the contest
    this.setState({
      processing: true
    });

    // prepare geocoder first before submission
    let coords = {
      lat: this.state.location[0],
      lng: this.state.location[1]
    };
    Geocoder.geocodePosition(coords).then(location => {
      Database.ref(
        `transactions/${this.state.prizeId}`
      ).once('value', data => {
        let transaction = data.val();
        let dateCreated = Date.now();

        // now create it
        let contestId = Database.ref('contests').push({
          '.value': {

            // stripe requires cents to be stored
            bounty: transaction.value / 100,
            dateCreated: dateCreated,

            // default a hour duration
            endDate: dateCreated + 3600000,
            instructions: this.state.instructions,
            prizes: {
              [this.state.prizeId]: true
            },
            referencePhotoId: this.state.referencePhotoId,
            createdBy: Firebase.auth().currentUser.uid,
            near: Platform.OS === 'ios' ? [
              location[0].feature, location[0].subLocality]
              .filter(l => l).join(' at ') || '...'
              : [location[0].streetNumber ? location[0].streetNumber + ' ' : ''
              + location[0].streetName,
              location[1].feature || location[1].locality]
              .filter(l => l).join(' at ') || '...'
          },
          '.priority': -(dateCreated + 3600000)
        }).key;

        // location via GeoFire
        new GeoFire(Database.ref('locations')).set(
          contestId, this.state.location
        );

        // add to owner's list
        Database.ref(
          `profiles/${
            Firebase.auth().currentUser.uid
          }/contests/${
            contestId
          }`
        ).set({
          '.value': true,
          '.priority': -(dateCreated + 3600000)
        });

        // and back out
        this.setState({
          prizeId: null,
          location: null,
          referencePhotoId: null,
          processing: false,
          instructions: DEFAULT_INSTRUCTIONS
        });

        Actions.contest({
          contestId: contestId,
          type: 'replace'
        });
      });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.OuterFrame
  },

  logo: {
    width: 30,
    height: 30
  }
});
