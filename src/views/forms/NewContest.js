import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Sizes
} from '../../Const';

// components
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';
import Payment from '../../components/common/Payment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChecklistItem from '../../components/lists/ChecklistItem';

export default class NewContest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prizeId: null,
      location: null,
      referencePhotoId: null
    };
  }

  render() {
    return (
      <View style={styles.container}>
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
            || !this.state.Location
            || !this.state.referencePhotoId
          }
          color={Colors.Primary}
          label='Start a new Photo Contest'
          onPress={() => Actions.modal({
            view: <Payment />
          })} />
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
