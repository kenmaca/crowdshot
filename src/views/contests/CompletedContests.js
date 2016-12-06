import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView
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
import CompletedContest from '../../components/contests/CompletedContest';

export default class CompletedContests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blob: {},
      contests: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `profiles/${Firebase.auth().currentUser.uid}/completedContests`
    );

    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {

    // set a timeout to allow smooth view transition on load
    this.delay = setTimeout(
      () => {
        this.listener = this.ref.on('value', data => {
          if (data.exists()) {
            let contests = data.val();
            this.setState({
              blob: contests,
              contests: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
              }).cloneWithRows(Object.keys(contests))
            });
          }

          // clear loader
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

  renderRow(contestId) {
    return (
      <CompletedContest contestId={contestId} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          showLoader
          ref='title'
          title='Purchased Photos' />
        <ListView
          key={Math.random()}
          scrollEnabled
          dataSource={this.state.contests}
          style={styles.contests}
          renderRow={this.renderRow} />
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

  contests: {
    flex: 1
  }
});
