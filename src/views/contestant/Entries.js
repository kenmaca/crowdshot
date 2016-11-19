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
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import EntryCard from '../../components/lists/EntryCard';
import Swipeout from 'react-native-swipeout';

export default class Settings extends Component {
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
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        let blob = data.val();
        this.setState({
          rawEntries: blob,
          entries: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          }).cloneWithRows(
            Object.keys(blob)
          )
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Your Contest Entries
          </Text>
        </View>
        <View style={styles.content}>
          <ListView
            key={Math.random()}
            scrollEnabled
            dataSource={this.state.entries}
            style={styles.entries}
            renderRow={this.renderRow.bind(this)} />
        </View>
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

  titleContainer:{
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Sizes.InnerFrame,
    height: Sizes.NavHeight,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H3
  },

  content: {
    flex: 1
  },

  entries: {
    flex: 1
  },

  entryContainer: {
    margin: Sizes.InnerFrame / 2,
    marginBottom: 0,
  }
});
