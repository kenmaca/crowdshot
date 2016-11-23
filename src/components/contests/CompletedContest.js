import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';
import DateFormat from 'dateformat';

// components
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Photo from '../../components/common/Photo';
import Divider from '../../components/common/Divider';
import InputSectionHeader from '../../components/common/InputSectionHeader';

export default class CompletedContest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contest: {},
      blob: {},
      entries: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `entries/${
        this.props.contestId
      }`
    );

    this.contestRef = Database.ref(
      `contests/${
        this.props.contestId
      }`
    );

    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        let entries = data.val();
        this.setState({
          blob: entries,
          entries: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          }).cloneWithRows(
            Object.keys(entries).filter(

              // only allow selected entries
              entryId => entries[entryId].selected
            ).map(

              // throw all data into list of objects
              entryId => ({
                ...entries[entryId],
                entryId: entryId
              })
            )
          )
        });
      }
    });

    this.contestListener = this.contestRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          contest: data.val()
        });
      }
    })
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.contestListener && this.contestRef.off('value', this.contestListener);
  }

  renderRow(entryBlob) {
    return (
      <TouchableOpacity
        onPress={() => Actions.purchasedPhoto({
          photoId: entryBlob.photoId,
          contestantId: entryBlob.createdBy
        })}>
        <Photo
          photoId={entryBlob.photoId}
          style={styles.photo} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      this.state.entries.getRowCount() > 0
      && (
        <View style={styles.container}>
          <InputSectionHeader
            label={
              DateFormat(this.state.contest.dateCreated, 'mmmm dS, yyyy')
            }
            style={styles.header}
            color={Colors.SubduedText}
            offset={0} />
          {
            this.state.contest.near && (
              <InputSectionHeader
                label={`near ${this.state.contest.near}`}
                style={styles.header}
                color={Colors.LightWhiteOverlay}
                offset={0} />
            )
          }
          <ListView
            key={Math.random()}
            horizontal
            scrollEnabled={false}
            dataSource={this.state.entries}
            contentContainerStyle={styles.entries}
            renderRow={this.renderRow} />
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Sizes.InnerFrame,
    backgroundColor: Colors.Transparent
  },

  header: {
    padding: 0
  },

  photo: {
    width: 100,
    height: 100,
    marginRight: Sizes.InnerFrame / 4,
    marginBottom: Sizes.InnerFrame / 4,
    borderRadius: 5
  },

  entries: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: Sizes.InnerFrame / 2
  }
});
