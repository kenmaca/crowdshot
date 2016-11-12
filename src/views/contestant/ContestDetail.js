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
import Button from '../../components/common/Button';
import InputSectionHeader from '../../components/common/InputSectionHeader';
import Photo from '../../components/common/Photo';
import Divider from '../../components/common/Divider';
import OutlineText from '../../components/common/OutlineText';
import CircleIconInfo from '../../components/common/CircleIconInfo';
import ContestThumbnail from '../../components/lists/ContestThumbnail';
import GroupAvatar from '../../components/profiles/GroupAvatar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import ContestCard from '../../components/lists/ContestCard';
import * as Progress from 'react-native-progress';

export default class ContestDetail extends Component {
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
        <ContestCard contestId={this.props.contest.contestId}/>
        <CloseFullscreenButton/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignSelf: 'stretch',
  },

  header: {
    height: Sizes.Height*0.4,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame
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
