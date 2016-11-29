import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ScrollView, ListView
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import TitleBar from '../../components/common/TitleBar';
import ContestProgressBar from '../../components/contests/ContestProgressBar';
import InputSectionHeader from '../../components/common/InputSectionHeader';
import Photo from '../../components/common/Photo';
import CircleIcon from '../../components/common/CircleIcon';
import Divider from '../../components/common/Divider';
import Avatar from '../../components/profiles/Avatar';
import GroupAvatar from '../../components/profiles/GroupAvatar';

export default class ContestStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: {},
      winners: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `contests/${
        this.props.contestId
      }`
    );

    this.entriesRef = Database.ref(
      `entries/${
        this.props.contestId
      }`
    );

    // methods
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        let contest = data.val() || {};
        this.setState({
          ...contest
        });

        // grab entries only when contest is ready
        if (!this.entriesListener) {
          this.entriesListener = this.entriesRef.on('value', data => {
            if (data.exists()) {
              let entries = data.val();
              let prizes = Object.keys(contest.prizes).length || 1;
              let winners = Object.keys(entries).filter(

                // only keep selected entries
                entryId => entries[entryId].selected
              ).map(entryId => ({

                // transform into a blob
                ...entries[entryId],
                entryId: entryId

              // only allow up to prizes length of winners
              })).slice(0, prizes);

              this.setState({
                winners: new ListView.DataSource({
                  rowHasChanged: (r1, r2) => r1 !== r2
                }).cloneWithRows([
                  ...winners,

                  // pad the winners list of unclaimed prizes
                  ...new Array(prizes - winners.length).fill(false)
                ]),
                entries: entries
              });
            }
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.entriesListener && this.entriesRef.off('value', this.entriesListener);
  }

  renderRow(entry) {
    return (
      entry ? (
        <View style={styles.prize}>
          <View style={styles.avatar}>
            <Avatar
              showRank
              uid={entry.createdBy}
              size={48} />
          </View>
          <Photo
            photoId={entry.photoId}
            style={styles.photo} />
        </View>
      ): (
        <View style={styles.prize}>
          <CircleIcon
            fontAwesome
            icon='trophy'
            size={48} />
          <Text style={styles.availableText}>
            {
              `Bounty of $${
                this.state.bounty
              } not yet assigned to any entry`
            }
          </Text>
        </View>
      )
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title='Contest Results' />
        <ContestProgressBar
          style={styles.progress}
          start={this.state.dateCreated}
          end={

            // end contest if either flag is present
            (this.state.isComplete || this.state.isCancelled)
            ? this.state.dateCreated + 1
            : this.state.endDate
          }
          interval={2000} />
        <ScrollView style={styles.content}>
          {
            this.state.instructions != null && (
              <View>
                <InputSectionHeader label='Instructions' />
                <Text style={styles.text}>
                  {this.state.instructions}
                </Text>
              </View>
            )
          }
          {
            this.state.entries && (
              <View>
                <InputSectionHeader
                  style={styles.header}
                  label='Participants' />
                <GroupAvatar
                  showRank
                  limit={10}
                  color={Colors.Foreground}
                  outlineColor={Colors.ModalBackground}
                  style={styles.participants}
                  uids={
                    Object.keys(
                      this.state.entries
                    ).map(
                      entryId => this.state.entries[entryId].createdBy
                    )
                  } />
              </View>
            )
          }
          <InputSectionHeader
            style={styles.header}
            label='Winners' />
          <View style={styles.prizeContainer}>
            <ListView
              key={Math.random()}
              scrollEnabled={false}
              dataSource={this.state.winners}
              renderSeparator={() => (
                <Divider
                  key={Math.random()}
                  style={styles.divider} />
              )}
              renderRow={this.renderRow} />
          </View>
        </ScrollView>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  progress: {
    backgroundColor: Colors.Foreground
  },

  content: {
    flex: 1,
    padding: Sizes.InnerFrame,
    backgroundColor: Colors.ModalBackground
  },

  text: {
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.AlternateText
  },

  header: {
    marginTop: Sizes.InnerFrame
  },

  prizeContainer: {
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame,
    borderRadius: 5,
    borderColor: Colors.LightOverlay,
    borderWidth: 1
  },

  prize: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  avatar: {
  },

  photo: {
    width: Sizes.Width * 0.6,
    height: Sizes.Width * 0.6,
    borderRadius: 5
  },

  divider: {
    backgroundColor: Colors.LightOverlay,
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.InnerFrame,
    height: 1
  },

  availableText: {
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.SubduedText
  },

  participants: {
    justifyContent: 'flex-start'
  }
});
