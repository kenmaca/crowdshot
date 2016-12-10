import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Platform
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

// const
const DEFAULT_INSTRUCTIONS = 'Take a photo with the contents shown in the reference photo above.\n\n';

export default class NewContestContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prizeId: null,
      location: null,
      referencePhotoId: null,
      processing: false,
      instructions: DEFAULT_INSTRUCTIONS
    };

    // methods
    this.submit = this.submit.bind(this);
  }

  render() {
    return (
      <View style={styles.container} />
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
              : [location[0].streetNumber + ' ' + location[0].streetName,
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
          contestId: contestId
        });
      });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary
  }
});
