import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, Alert
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
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import EntryCard from '../../components/lists/EntryCard';
import Swipeout from 'react-native-swipeout';
import SwipeoutButton from '../../components/common/SwipeoutButton';

export default class Entries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawEntries: {},
      entries: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/entries`
    );
  }

  componentDidMount() {

    // delay load to smooth load transition
    this.delay = setTimeout(
      () => {
        this.listener = this.ref.on('value', data => {

          // dont check exists due to empty entries allowed
          let blob = data.val() || {};
          this.setState({
            rawEntries: blob,
            entries: new ListView.DataSource({
              rowHasChanged: (r1, r2) => r1 !== r2
            }).cloneWithRows(
              Object.keys(blob)
            )
          });

          // and clear loader
          this.refs.title.clearLoader();
        });
      },
      500
    );
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.delay && clearTimeout(this.delay);
  }

  renderRow(entryId) {
    return (
      <View style={styles.entryContainer}>
        <Swipeout
          right={[
            {
              text: 'Remove',
              color: Colors.Text,
              backgroundColor: Colors.Cancel,
              component: (
                <SwipeoutButton
                  text='Remove' />
              ),
              onPress: () => {
                Alert.alert(
                  'Remove this Contest Entry?',
                  null,
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    }, {
                      text: 'Remove',
                      onPress: () => {
                        Database.ref(
                          `profiles/${
                            Firebase.auth().currentUser.uid
                          }/entries/${
                            entryId
                          }`
                        ).remove();
                      }
                    }
                  ]
                );
              }
            }
          ]}>
          <EntryCard
            contestId={this.state.rawEntries[entryId]}
            entryId={entryId} />
        </Swipeout>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          showLoader
          ref='title'
          title='Your Contest Entries' />
        <View style={styles.content}>
          <ListView
            enableEmptySections
            scrollEnabled
            removeClippedSubviews
            dataSource={this.state.entries}
            style={styles.entries}
            renderRow={this.renderRow.bind(this)} />
        </View>
        <CloseFullscreenButton back />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  content: {
    flex: 1
  },

  entries: {
    flex: 1
  },

  entryContainer: {
    marginBottom: 2,
  }
});
