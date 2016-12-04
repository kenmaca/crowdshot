import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ScrollView, ListView,
  TouchableOpacity, Alert, Modal
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import DateFormat from 'dateformat';

// components
import Button from '../../components/common/Button';
import InputSectionHeader from '../../components/common/InputSectionHeader';
import Photo from '../../components/common/Photo';
import Divider from '../../components/common/Divider';
import TrophyCase from '../../components/contests/TrophyCase';
import CircleIconInfo from '../../components/common/CircleIconInfo';
import CircleIcon from '../../components/common/CircleIcon';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import CameraView from '../../components/common/CameraView';
import ContestProgressBar from '../../components/contests/ContestProgressBar';
import HostInfo from '../../components/profiles/HostInfo';

export default class ContestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraVisible: false,
      preview: null,
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
        let entryPhotos = [];
        Object.entries(data.val()).forEach(([key, m]) => {
          if (m.createdBy == Firebase.auth().currentUser.uid){
            entryPhotos.push(m.photoId);
          }
        });
        this.setState({
          entries: data.val(),
          thumbnails: this.state.thumbnails.cloneWithRows(entryPhotos)
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.entriesListener && this.entriesRef.off('value', this.entriesListener);
  }

  render() {
    return (
      <View style={styles.container}>
        <Photo
          photoId={this.state.referencePhotoId}
          style={styles.header}>
          <TrophyCase
            bounty={this.state.bounty}
            prizes={this.state.prizes} />
        </Photo>
        <View style={styles.body}>
          <ContestProgressBar
            start={this.state.dateCreated}
            end={this.state.endDate}
            interval={20000} />
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
              </TouchableOpacity>
            </View>
            <Divider style={styles.divider} />
            {
              this.state.thumbnails.getRowCount() > 0 && (
                <View style={styles.instructionContainer}>
                  <InputSectionHeader
                    offset={Sizes.InnerFrame}
                    label='Your submissions' />
                  <ListView
                    horizontal
                    scrollEnabled={false}
                    dataSource={this.state.thumbnails}
                    style={styles.thumbnailList}
                    contentContainerStyle={styles.thumbnailContainer}
                    renderRow={data => {
                      return (
                        <TouchableOpacity
                          onPress={() => this.setState({preview:data})}>
                          <Photo
                            photoId={data}
                            style={styles.thumbnails}/>
                        </TouchableOpacity>
                      );
                    }} />
                </View>
              )
            }
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
              this.state.createdBy && (
                <HostInfo profileId={this.state.createdBy} />
              )
            }
            <View style={styles.bottomPadding}/>
          </ScrollView>
        </View>
        <ParticipateButton
          onPress={() => this.setState({
            cameraVisible: true
          })}
          contest={this.state} />
        <CloseFullscreenButton/>
        <Modal
          transparent
          onRequestClose={() => this.setState({cameraVisible:false})}
          animationType='fade'
          visible={this.state.cameraVisible}>
          <CameraView
            onUploaded={(photoId) => {
              this.setState({
                cameraVisible: false,
              });

              let entryId = this.entriesRef.push({
                '.value': {
                  createdBy: Firebase.auth().currentUser.uid,
                  dateCreated: Date.now(),
                  photoId: photoId
                },
                '.priority': -Date.now()
              }).key

              // and add to profile's list of entries
              Database.ref(
                `profiles/${
                  Firebase.auth().currentUser.uid
                }/entries/${
                  entryId
                }`
              ).set({
                '.value': this.props.contestId,
                '.priority': -Date.now()
              });

              // and update profile counts
              let attempts = Database.ref(
                `profiles/${
                  Firebase.auth().currentUser.uid
                }/countAttempts`
              )
              attempts.once(
                'value',
                data => attempts.set((data.val() || 0) + 1)
              );
            }}
            />
          <CloseFullscreenButton
            action={() => this.setState({cameraVisible:false})}/>
        </Modal>
        <Modal
          transparent
          onRequestClose={() => this.setState({preview:null})}
          animationType='fade'
          visible={this.state.preview != null}>
          <View style={styles.previewContainer}>
            <Photo
              photoId={this.state.preview}
              style={styles.preview}
              resizeMode='cover'
              />
            <CloseFullscreenButton
              action={() => this.setState({preview:null})}/>
          </View>
        </Modal>
      </View>
    );
  }
}

export class ParticipateButton extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  componentDidMount() {

    // create auto refresh disabler based on time
    this.update();
  }

  componentWillUnmount() {
    this.refresher && clearTimeout(this.refresher);
  }

  update() {
    this.setState({
      refreshed: true
    });

    // schedule next refresh
    this.refresher = setTimeout(this.update, 2000);
  }

  render() {
    return (
      <Button
        squareBorders
        color={Colors.Primary}
        onPress={this.props.onPress}
        label={
          this.props.contest.thumbnails.getRowCount() > 0
          ? 'Submit another Entry': 'Participate'
        }
        isDisabled={
          !this.props.contest.referencePhotoId
          || Date.now() > this.props.contest.endDate
          || this.props.contest.isComplete
          || this.props.contest.isCancelled
        }
        onPressDisabled={() => Alert.alert(
          'Contest has ended',
          'The contest has either ended or the owner has cancelled it'
        )}
        disabledColor={Colors.MediumDarkOverlay} />
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: Colors.ModalBackground,
  },

  header: {
    height: Sizes.Height*0.4,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame,
  },

  body: {
    flex: 1,
    backgroundColor: Colors.ModalBackground,
  },

  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.OuterFrame,
    backgroundColor: Colors.ModalBackground
  },

  progressStaticText: {
    color: Colors.SubduedText,
    fontSize: Sizes.Text,
    fontWeight: '700'
  },

  detailContainer: {
    flex: 1,
    paddingBottom: Sizes.OuterFrame,
  },

  summary: {
    padding: Sizes.InnerFrame
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

  submittedPhoto: {
    height: Sizes.Width*0.8,
    margin: Sizes.InnerFrame,
    backgroundColor: Colors.ModalBackground
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

  thumbnailList: {
    flex: 1,
    marginLeft: Sizes.InnerFrame,
    marginRight: Sizes.InnerFrame,
    alignSelf: 'stretch'
  },

  thumbnailContainer: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: Sizes.InnerFrame/2
  },

  thumbnails: {
    height: 80,
    width: 80,
    marginRight: Sizes.InnerFrame/3,
    marginBottom: Sizes.InnerFrame/3,
    backgroundColor: Colors.Overlay
  },

  previewContainer: {
    height: Sizes.Height,
    width: Sizes.Width,
    backgroundColor: Colors.DarkOverlay,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },

  preview: {
    marginHorizontal: Sizes.InnerFrame,
    width: Sizes.Width * 0.9,
    height: Sizes.Width * 0.9 * 4 / 3,
    backgroundColor: Colors.Transparent
  },

  buttonStyle: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },

  bottomPadding: {
    paddingBottom: Sizes.OuterFrame,
    backgroundColor: Colors.ModalForeground
  }
});
