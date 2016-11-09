import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ScrollView, ListView,
  TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';
import Database from '../../utils/Database';
import DateFormat from 'dateformat';

// components
import Button from '../common/Button';
import InputSectionHeader from '../common/InputSectionHeader';
import Photo from '../common/Photo';
import Divider from '../common/Divider';
import OutlineText from '../common/OutlineText';
import CircleIconInfo from '../common/CircleIconInfo';
import ContestThumbnail from '../lists/ContestThumbnail';
import GroupAvatar from '../profiles/GroupAvatar';
import * as Progress from 'react-native-progress';

export default class ContestCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateCreated: Date.now(),
      currentTime: Date.now(),
      progress: 0,
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

    this.updateProgress = this.updateProgress.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });

        // animated progress
        this.updateProgress();
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
  }

  updateProgress() {
    let duration = parseInt(this.state.endDate) - parseInt(this.state.dateCreated);
    let elapsed = Date.now() - parseInt(this.state.dateCreated);
    this.setState({
      progress: (
        (duration !== 0)
        ? (
          (elapsed < duration)
          ? elapsed / duration
          : 1
        ): 0
      )
    });

    // refresh
    this.progress = setTimeout(this.updateProgress, 20000);
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.entriesListener && this.entriesRef.off('value', this.entriesListener);
    this.progress && clearTimeout(this.progress);
  }

  render() {
    return (
      <View style={styles.container}>
        <Photo
          photoId={this.state.referencePhotoId}
          style={styles.header}>
          <View style={styles.buttonContainer}>
            <Button
              size={Sizes.H2}
              style={styles.button}
              icon='delete-forever'
              color={Colors.Transparent} />
          </View>
          <OutlineText
            text={
              `$${
                this.state.bounty || 0
              } Bounty To Top ${
                this.state.prizes
                ? Object.keys(this.state.prizes).length
                : 'Photo'
              }`} />
        </Photo>
        <View style={styles.body}>
          <View style={styles.progressContainer}>
            {
              this.state.progress < 1
              ? (
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressTextUntil}>
                    CONTEST ENDS ON
                  </Text>
                  <Text style={styles.progressTextEnd}>
                    {DateFormat(this.state.endDate, 'dddd, h:MMTT')}
                  </Text>
                </View>
              ): (
                <Text style={styles.progressTextUntil}>
                  CONTEST ENDED
                </Text>
              )
            }
            <Progress.Bar
              animated
              progress={this.state.progress}
              width={Sizes.Width - Sizes.InnerFrame * 4}
              color={Colors.Primary}
              unfilledColor={Colors.LightOverlay}
              borderWidth={0} />
          </View>
          <ScrollView style={styles.detailContainer}>
            <View style={styles.summary}>
              <CircleIconInfo
                size={Sizes.H2}
                color={Colors.Foreground}
                icon='location-city'
                label='Near Queen St W and Spadina' />
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
            </View>
            <Divider style={styles.divider} />
            <View style={styles.instructionContainer}>
              <InputSectionHeader label='Instructions' />
              <Text style={styles.instructions}>
                {this.state.instructions}
              </Text>
            </View>
            <View style={styles.instructionContainer}>
              <InputSectionHeader label='Photographers Nearby' />
              <GroupAvatar
                limit={1}
                uids={[
                  '6P2NtwmzQWh0opdbuy0JwqSgPR02',
                  'eyGDNyiqUBdu9ziuwCQehed13wr1',
                  'ht33R6YWUWQMc8SZb27o9BOzn6G3'
                ]}
                size={Sizes.InnerFrame * 3}
                color={Colors.Foreground}
                outlineColor={Colors.ModalBackground}
                style={styles.photographersNearby} />
            </View>
            <View style={styles.photoContainer}>
              <InputSectionHeader label='Contest Entries' />
              <ListView
                horizontal
                scrollEnabled={false}
                dataSource={this.state.thumbnails}
                style={styles.thumbnailContainer}
                contentContainerStyle={styles.thumbnails}
                renderRow={data => {
                  return (
                    <TouchableOpacity
                      onPress={() => Actions.contestPhotos({
                        contestId: 'testContest',
                        startCard: data
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
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Sizes.Width - Sizes.InnerFrame / 2,
    borderRadius: 5,
    overflow: 'hidden'
  },

  header: {
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame
  },

  body: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.OuterFrame,
    backgroundColor: Colors.DarkOverlay
  },

  progressTextContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

  progressTextUntil: {
    padding: Sizes.InnerFrame / 2,
    paddingTop: 0,
    color: Colors.SubduedText,
    fontSize: Sizes.SmallText,
    fontWeight: '700'
  },

  progressTextEnd: {
    padding: Sizes.InnerFrame / 2,
    paddingTop: 0,
    color: Colors.SubduedText,
    fontWeight: '700'
  },

  detailContainer: {
    flex: 1,
    paddingBottom: Sizes.OuterFrame * 10
  },

  summary: {
    padding: Sizes.InnerFrame
  },

  instructionContainer: {
    marginTop: Sizes.InnerFrame,
  },

  instructions: {
    marginLeft: Sizes.InnerFrame,
    color: Colors.AlternateText,
    fontWeight: '100'
  },

  photographersNearby: {
    marginLeft: Sizes.InnerFrame,
    justifyContent: 'flex-start'
  },

  photoContainer: {
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame * 3,
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
});
