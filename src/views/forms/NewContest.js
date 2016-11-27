import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Modal, Alert
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import GeoFire from 'geofire';
import Geocoder from 'react-native-geocoder';

// components
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChecklistItem from '../../components/lists/ChecklistItem';
import ProgressBlocker from '../../components/common/ProgressBlocker';

const DEFAULT_INSTRUCTIONS = 'Take a photo with the contents shown in the reference photo above.\n\n';

export default class NewContest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prizeId: null,
      location: null,
      referencePhotoId: null,
      processing: false,
      instructions: DEFAULT_INSTRUCTIONS
    };

    this.submit = this.submit.bind(this);
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
          near: `${
            location[0].feature
          } at ${
            location[0].subLocality
          }`
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
        ).set(true);

        // and back out
        // TODO: send directly to the card expanded
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

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent
          visible={this.state.processing}
          animationType='fade'>
          <ProgressBlocker
            message='Setting up your Contest..' />
        </Modal>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Let's setup your contest
          </Text>
          <Text style={styles.headerSubtitle}>
            We'll need a bit of information before
            we can start:
          </Text>
        </View>
        <View style={styles.checklist}>
          <ChecklistItem
            onPress={() => Actions.newPayment({
              onCharged: transactionId => this.setState({
                prizeId: transactionId
              })
            })}
            checked={this.state.prizeId}
            photoId='appNewContestBounty'
            title='Set the bounty,'
            subtitle={
              'Add a cash prize for the winning entry. '
              + 'Prizes are only awarded at the end if '
              + 'there are entries submitted.'
            } />
          <ChecklistItem
            onPress={() => Actions.mapMarkerDrop({
              onSelected: location => this.setState({
                location: location
              })
            })}
            checked={this.state.location}
            photoId='appNewContestLocation'
            title='then tell us where,'
            subtitle={
              'Set a marker on the map indicating where '
              + 'contestants should take photos at.'
            } />
          <ChecklistItem
            onPress={() => Actions.newReferencePhoto({
              onTaken: photoId => {
                this.setState({
                  referencePhotoId: photoId
                });

                // launch textEntry for instructions
                Actions.textEntry({
                  onSubmit: text => this.setState({
                    instructions: text
                  }),
                  title: 'Contest Instructions',
                  label: 'Instructions',
                  subtitle: 'General rules for your contest',
                  buttonLabel: 'Add Instructions',
                  value: this.state.instructions
                });
              }
            })}
            checked={this.state.referencePhotoId}
            photoId='appNewContestCamera'
            title='.. and finally, a reference photo.'
            subtitle={
              'Take a reference photo of what you want '
              + 'a photo of. It can be anything from an object, '
              + 'a landmark, — or even your faces.'
            } />
        </View>
        <Button
          isDisabled={
            !this.state.prizeId
            || !this.state.location
            || !this.state.referencePhotoId
          }
          color={Colors.Primary}
          label='Start a new Photo Contest'
          onPressDisabled={() => Alert.alert(
            'Missing contest details',
            'Please fill in the details above'
          )}
          onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Background
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.OuterFrame,
    paddingTop: 0,
    paddingBottom: Sizes.InnerFrame
  },

  headerTitle: {
    textAlign: 'center',
    paddingBottom: Sizes.InnerFrame / 2,
    color: Colors.Text,
    fontSize: Sizes.H0
  },

  headerSubtitle: {
    textAlign: 'center',
    color: Colors.SubduedText,
    fontSize: Sizes.H4
  },

  checklist: {
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame,
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.InnerFrame
  }
});
