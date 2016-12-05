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
      rawChat: {},
      activeChat: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      }),
      totalUnread: 0
    };

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat`
    );

    this.chatRef = Database.ref(
      `chats`
    )

    this.emptyChat = this.emptyChat.bind(this);

    this.unread = this.unread.bind(this);
  }

  emptyChat(chatId) {
    if (this.state.chatMessage && this.state.chatMessage[chatId]) {
      return true
    }
    return false
  }

  unread(chatId) {
    //number of unread messages init
    var unread = 0;

    //get the latest chat closed time
    //get the number of unread messages
    Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat/${chatId}`
    ).once('value', date => {
      Database.ref(
        `chats/${chatId}`
      ).on('value', data => {
        let blob = Object.keys(data.val())
        blob.map(i => {
          if (i > date.val()) {
            unread ++
          }
        })
      })
    })
    return unread;
  }

  componentDidMount() {

    this.listener = this.ref.on('value', data => {
        let blob = data.val() || {};
        this.setState({
          rawChat: blob,
          activeChat: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          }).cloneWithRows(
            Object.keys(blob)
          )

        });

        // and clear loader
        this.refs.title.clearLoader();
    });

    this.chatListener = this.chatRef.on('value', data => {
      data.exists() && this.setState({
        chatMessage: data.val()
      })
    })
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.chatListener && this.chatRef.off('value', this.chatListener);
  }

  renderRow(chatId) {
    return (
      <View>
        {
          this.emptyChat(chatId) && (
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
                                  chatId
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
                  chatId={chatId}
                  unread={this.unread(chatId)} />
              </Swipeout>
            </View>
          )
        }
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          clearLoader
          title='Crowd Chat'
          ref='title' />
        <View style={styles.content}>
          <ListView
            enableEmptySections
            key={Math.random()}
            scrollEnabled
            dataSource={this.state.activeChat}
            style={styles.activeChat}
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

  activeChat: {
    flex: 1
  },

  chatContainer: {
    margin: Sizes.InnerFrame / 2,
    marginBottom: 0
  },

  title: {
    alignItems: 'center'
  }
})
