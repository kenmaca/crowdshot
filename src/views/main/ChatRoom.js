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
import SwipeoutButton from '../../components/common/SwipeoutButton';
import ChatCard from '../../components/chat/ChatCard';
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
    };

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat`
    );

    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {

    // delay load for transition smoothing
    this.delay = setTimeout(
      () => {
        this.listener = this.ref.on('value', data => {
          let blob = data.val() || {};
          this.setState({
            chats: this.state.chats.cloneWithRows(
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

  renderRow(chatId) {
    return (
      <View style={styles.chatContainer}>
        <Swipeout
          right={[
            {
              text: 'Unsubscribe',
              color: Colors.Text,
              backgroundColor: Colors.Cancel,
              component: (
                <SwipeoutButton
                  text='Unsubscribe' />
              ),
              onPress: () => {
                Alert.alert(
                  'Unsubscribe from this message?',
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
          <ChatCard chatId={chatId} />
        </Swipeout>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          showLoader
          title='Messages'
          ref='title' />
        <View style={styles.content}>
          <ListView
            enableEmptySections
            scrollEnabled
            dataSource={this.state.chats}
            style={styles.activeChat}
            renderRow={this.renderRow} />
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
    marginBottom: 2
  },

  title: {
    alignItems: 'center'
  }
});
