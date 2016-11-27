import React, {
  Component
} from 'react';
import {
  View, StyleSheet, ListView, Alert
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

import * as Firebase from 'firebase';
import Database from '../../utils/Database'
import Swipeout from 'react-native-swipeout';
import ChatCard from '../../components/chat/ChatCard';
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawEntries: {},
      entries: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
    };

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat`
    );
  }

  componentDidMount() {
    // add to owner's list
    Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat/${
        this.props.contestId
      }`
    ).set(true);

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
      this.refs.title.clearLoader();
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  renderRow(contestId) {
    return (
      <View style={styles.chatContainer}>
        <Swipeout
          right={[
            {
              text: 'Remove',
              color: Colors.Text,
              backgroundColor: Colors.Cancel,
              onPress: () => {
                Alert.alert(
                  'Remove this Chat Entry?',
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
                          }/activeChat/${
                            contestId
                          }`
                        ).remove();
                      }
                    }
                  ]
                );
              }
            }
          ]}>
          <ChatCard
            chatId={contestId}

             />
      </Swipeout>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          clearLoader
          ref='title'
          title='Your Contest Chat Room' />
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
    backgroundColor: Colors.ModalBackground
  },

  content: {
    flex: 1
  },

  entries: {
    flex: 1
  },

  chatContainer: {
    margin: Sizes.InnerFrame / 2,
    marginBottom: 0
  }
})
