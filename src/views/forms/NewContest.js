import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Modal
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';

// components
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChecklistItem from '../../components/lists/ChecklistItem';
import ProgressBlocker from '../../components/common/ProgressBlocker';

export default class NewContest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prizeId: null,
      location: null,
      referencePhotoId: null,
      processing: false
    };

    this.submit = this.submit.bind(this);
  }

  submit() {

    // block view as we setup the contest
    this.setState({
      processing: true
    });

    Database.ref(
      `prizes/${this.state.prizeId}`
    ).once('value', data => {
      let prize = data.val();
      let dateCreated = Date.now();

      // now create it
      let contestId = Database.ref('contests').push({

        // stripe requires cents to be stored
        bounty: prize.value / 100,
        dateCreated: dateCreated,

        // default a hour duration
        endDate: dateCreated + 360000,

        // TODO: add in Photo upload
        instructions: 'Not implemented.',
        prizes: {
          [this.state.prizeId]: true
        },
        referencePhotoId: this.state.referencePhotoId
      }).key;

      // TODO: use geofire to add location

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
        processing: false
      });
      Actions.mainMain();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent
          visible={this.state.processing}
          animationType='slide'>
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
            onPress={() => Actions.newBounty({
              onCharged: prizeId => this.setState({
                prizeId: prizeId
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
              onTaken: photoId => this.setState({
                referencePhotoId: photoId
              })
            })}
            checked={this.state.referencePhotoId}
            photoId='appNewContestCamera'
            title='.. and finally, a photo.'
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
    padding: Sizes.OuterFrame,
    paddingTop: 0,
    paddingBottom: Sizes.InnerFrame
  },

  headerTitle: {
    textAlign: 'center',
    marginBottom: Sizes.InnerFrame / 2,
    color: Colors.Text,
    fontSize: Sizes.H1
  },

  headerSubtitle: {
    textAlign: 'center',
    color: Colors.SubduedText,
    fontSize: Sizes.H4
  },

  checklist: {
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame
  }
});
