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

export default class ContestSummaryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contest: props.contest,
      dateCreated: Date.now(),
      currentTime: Date.now(),
      progress: 0,
      entries: {},
      thumbnails: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `contests/${this.props.contest.contestId}`
    );
    this.entriesRef = Database.ref(
      `entries/${this.props.contest.contestId}`
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
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.progress && clearTimeout(this.progress);
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

  render() {
    return (
      <TouchableOpacity style={styles.container}
        onPress={() => Actions.contestDetail({contest:this.state.contest})}>
        {this.state.contest.selected ?
        <View style={[styles.indicator,styles.selected]}/>
        :
        <View style={styles.indicator}/>
        }
        <View style={styles.card}>
          <Photo
            photoId={this.state.referencePhotoId}
            style={styles.header}>
            <OutlineText
              text={
                `$${
                  this.state.bounty || 0
                } To Top ${
                  this.state.prizes
                  ? Object.keys(this.state.prizes).length
                  : 'Photo'
                }`} />
          </Photo>
          <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
            {
              this.state.progress < 1
              ? (
                <Text style={styles.progressTextUntil}>
                  {"ENDING " + DateFormat(this.state.endDate, 'dddd, h:MMTT')}
                </Text>
              ): (
                <Text style={styles.progressTextUntil}>
                  CONTEST ENDED
                </Text>
              )
            }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height: Sizes.Height*0.25,
  },

  indicator: {
    height: 5,
    marginTop: 13,
    marginBottom: 3,
    marginHorizontal: Sizes.InnerFrame
  },

  selected: {
    backgroundColor: Colors.Primary,
  },

  card: {
    flex: 1,
    height: 130,
    width: Sizes.Width - Sizes.OuterFrame * 2,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.ModalBackground,
    marginTop: Sizes.InnerFrame / 4,
    marginLeft: Sizes.InnerFrame / 4,
    marginRight: Sizes.InnerFrame / 4,
    shadowColor: Colors.DarkOverlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },

  header: {
    height: Sizes.Height*0.25 - 45,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame/2
  },

  body: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  progressContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressTextContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row'
  },

  progressTextUntil: {
    paddingTop: 3,
    color: Colors.EmphasizedText,
    fontSize: Sizes.SmallText,
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
