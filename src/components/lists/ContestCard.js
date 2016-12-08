import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ScrollView, ListView,
  TouchableOpacity, Alert, TouchableWithoutFeedback
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import Geocoder from 'react-native-geocoder';

// components
import Button from '../common/Button';
import InputSectionHeader from '../common/InputSectionHeader';
import Photo from '../common/Photo';
import Divider from '../common/Divider';
import CircleIconInfo from '../common/CircleIconInfo';
import ContestThumbnail from '../lists/ContestThumbnail';
import GroupAvatar from '../profiles/GroupAvatar';
import ContestProgressBar from '../contests/ContestProgressBar';
import CloseFullscreenButton from '../common/CloseFullscreenButton';
import NearbyAvatars from '../profiles/NearbyAvatars';
import TrophyCase from '../contests/TrophyCase';

export default class ContestCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: {},
      thumbnails: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `contests/${this.props.contestId}`
    );
    this.entriesRef = Database.ref(
      `entries/${this.props.contestId}`
    );
    this.locationRef = Database.ref(
      `locations/${this.props.contestId}/l`
    );
  }

  unread(chatId) {
    //number of unread messages init
    var unread = 0;

    //get the latest chat closed time
    //get the number of unread messages
    Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat/${chatId}`
    ).once('value', date => {
      Database.ref(
        `chats/${chatId}`
      ).on('value', data => {
        if (data.exists()) {
          let blob = Object.keys(data.val())
          blob.map(i => {
            if (i > date.val()) {
              unread ++
            }
          })
        }
      })
    })
    return unread;
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });
      }
    });

    this.entriesListener = this.entriesRef.on('value', data => {
      if (data.exists()) {
        let entries = data.val();
        this.setState({
          entries: entries,
          thumbnails: this.state.thumbnails.cloneWithRows(
            Object.keys(entries)
          )
        });
      }
    });

    this.locationListener = this.locationRef.on('value', data => {
      if (data.exists()) {
        let location = data.val();
        this.setState({
          latitude: location[0],
          longitude: location[1]
        });
      }
    })
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.entriesListener && this.entriesRef.off('value', this.entriesListener);
    this.locationListener && this.locationRef.off('value', this.locationListener);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={this.props.toggle}>
          <Photo
            photoId={this.state.referencePhotoId}
            style={styles.header}>
            <TrophyCase
              isOwn
              bounty={this.state.bounty}
              prizes={this.state.prizes}
              onPress={() => {
                Actions.newPayment({
                  titleText: 'Add another Prize',
                  disclaimerText: 'This will be charged to your '
                    + 'chosen payment method immediately. Unused bounties '
                    + 'will be refunded at the end of the contest.',
                  fixedValue: this.state.bounty,
                  description: 'Additional Bounty for Photo Contest',
                  onCharged: prizeId => Database.ref(
                    `contests/${
                      this.props.contestId
                    }/prizes/${
                      prizeId
                    }`
                  ).set({
                    '.value': true,
                    '.priority': -Date.now()
                  })
                });
              }} />
          </Photo>
        </TouchableWithoutFeedback>
        <View style={[
          styles.body,
          !this.props.isCard && {
            paddingBottom: 0
          }
        ]}>
          <ContestProgressBar
            isOwn
            start={this.state.dateCreated}
            end={this.state.endDate}
            interval={20000}
            onPressComplete={() => Actions.voting({
              contestId: this.props.contestId
            })}
            onPressIncomplete={() => Actions.newPayment({
              titleText: 'Extending your Contest',
              disclaimerText: 'By extending your contest, the credit card on '
                + 'file will be billed for $1 to extend your contest by an '
                + 'hour\n\nYou may continue to extend your contest as long '
                + 'it remains active',
              fixedValue: 1,
              description: '1 Hour Extension for Photo Contest',
              submitText: 'Extend my Contest by an hour',
              onCharged: transactionId => this.ref.update({
                endDate: this.state.endDate + 3600000
              })
            })} />
          <ScrollView style={styles.detailContainer}>
            <View style={styles.summary}>
              {
                this.state.near && (
                  <CircleIconInfo
                    size={Sizes.H2}
                    color={Colors.Foreground}
                    icon='location-city'
                    label={`Near ${this.state.near}`} />
                )
              }
              <CircleIconInfo
                size={Sizes.H2}
                color={Colors.Foreground}
                icon='burst-mode'
                label={
                  `${
                    Object.keys(this.state.entries).length
                  } entries submitted from ${
                    Object.keys(
                      Object.values(this.state.entries).reduce(
                        (a, b) => (
                          {
                            photographers: Object.assign(
                              a.photographers || {},
                              b.photographers || {},
                              {[a.createdBy]: true},
                              {[b.createdBy]: true}
                            )
                          }
                        ), {photographers: {}}
                      ).photographers
                    ).filter(key => key != 'undefined').length
                  } photographers`
                } />
              <TouchableOpacity
                onPress={() => Actions.chat({
                  chatId: this.props.contestId,
                  title: 'Contest Chat'
                })}>
                <CircleIconInfo
                  size={Sizes.H2}
                  color={Colors.Foreground}
                  icon='message'
                  label='Open contest chat' />
                  {
                    this.unread(this.props.contestId) > 0
                    && (
                      <View style={styles.unreadContainer}>
                        <Text style={styles.unread}>
                          {this.unread(this.props.contestId)}
                        </Text>
                      </View>
                    )
                  }
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <Divider style={styles.divider} />
              {
                !!this.state.instructions
                && (
                  <View style={styles.instructionContainer}>
                    <InputSectionHeader
                      offset={Sizes.InnerFrame}
                      label='Instructions' />
                    <Text style={styles.instructions}>
                      {this.state.instructions}
                    </Text>
                  </View>
                )
              }
              {
                this.state.latitude && this.state.longitude
                && (
                  <View style={styles.instructionContainer}>
                    <InputSectionHeader
                      offset={Sizes.InnerFrame}
                      label='Photographers Nearby' />
                    <NearbyAvatars
                      showRank
                      limit={6}
                      latitude={this.state.latitude}
                      longitude={this.state.longitude}
                      size={Sizes.InnerFrame * 3}
                      color={Colors.Foreground}
                      outlineColor={Colors.ModalBackground}
                      style={styles.photographersNearby} />
                  </View>
                )
              }
              {
                this.state.thumbnails.getRowCount() > 0 && (
                  <View style={styles.photoContainer}>
                    <InputSectionHeader
                      offset={Sizes.InnerFrame}
                      label='Contest Entries' />
                    <ListView
                      horizontal
                      scrollEnabled={false}
                      dataSource={this.state.thumbnails}
                      style={styles.thumbnailContainer}
                      contentContainerStyle={styles.thumbnails}
                      renderRow={data => {
                        return (
                          <TouchableOpacity
                            onPress={() => Actions.voting({
                              contestId: this.props.contestId
                            })}>
                            <ContestThumbnail
                              size={80}
                              rejectedOverlay={Colors.WhiteOverlay}
                              contestId={this.props.contestId}
                              entryId={data} />
                          </TouchableOpacity>
                        );
                      }} />
                  </View>
                )
              }
            </View>
            <View style={styles.footerContainer}>
              <Button
                isDisabled={
                  Object.keys(this.state.entries).length
                  > 0
                }
                onPress={() => Alert.alert(
                  'Contest Cancellation',
                  'You may cancel your contest at any time if there '
                  + 'have been no entries submitted. All prizes are '
                  + 'refunded back to your original method of payment',
                  [
                    {
                      text: 'Cancel my Contest',
                      onPress: () => {

                        // add to server backlog to process refunds
                        this.ref.update({
                          isCancelled: true
                        });
                        Database.ref(
                          `contestTasks/${
                            this.props.contestId
                          }`
                        ).set(true);

                        // and out
                        Actions.mainMainView({
                          toggle: true
                        });
                      }
                    }, {
                      text: 'Cancel',
                      style: 'cancel'
                    }
                  ]
                )}
                squareBorders
                color={Colors.Cancel}
                fontColor={Colors.Text}
                style={styles.cancelButton}
                label='Cancel this Contest and Refund all Prizes' />
            </View>
          </ScrollView>
        </View>
        {!this.props.isCard && (
          <CloseFullscreenButton />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame
  },

  body: {
    flex: 1,
    backgroundColor: Colors.ModalBackground,
    paddingBottom: Sizes.NavHeight - Sizes.InnerFrame
  },

  detailContainer: {
    flex: 1
  },

  summary: {
    padding: Sizes.InnerFrame
  },

  content: {
    flex: 1,
    minHeight: Sizes.Height / 4.25
  },

  instructionContainer: {
    marginTop: Sizes.InnerFrame,
  },

  instructions: {
    marginLeft: Sizes.InnerFrame,
    marginRight: Sizes.InnerFrame,
    color: Colors.AlternateText,
    fontWeight: '100'
  },

  photographersNearby: {
    marginLeft: Sizes.InnerFrame,
    justifyContent: 'flex-start'
  },

  photoContainer: {
    marginTop: Sizes.InnerFrame,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },

  button: {
    paddingTop: Sizes.InnerFrame / 2,
    paddingBottom: Sizes.InnerFrame / 2,
    paddingLeft: Sizes.InnerFrame / 2,
    paddingRight: Sizes.InnerFrame / 2
  },

  thumbnailContainer: {
    flex: 1,
    marginLeft: Sizes.InnerFrame,
    marginRight: Sizes.InnerFrame,
    alignSelf: 'stretch'
  },

  thumbnails: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center'
  },

  footerContainer: {
    margin: Sizes.InnerFrame,
    alignSelf: 'stretch'
  },

  unreadContainer: {
    position: 'absolute',
    top: 6,
    right: Sizes.InnerFrame,
    padding: Sizes.InnerFrame /2,
    paddingTop: Sizes.InnerFrame /4,
    paddingBottom: Sizes.InnerFrame /4,
    borderRadius: 20,
    backgroundColor: Colors.Cancel
  },

  unread: {
    fontSize: Sizes.SmallText,
    color: Colors.Text,
    fontWeight: '500'
  }
});
