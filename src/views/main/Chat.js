import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
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
import {
  GiftedChat
} from 'react-native-gifted-chat';
import Avatar from '../../components/profiles/Avatar';
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };

    this.ref = Database.ref(
      `chats/${this.props.chatId}`
    );

    this.activeChatRef = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat/${this.props.chatId}`
    );

    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {

    this.activeChatListener = this.activeChatRef.on('value', data => {
      if(!data.exists()) {
        //add to owner's list
        Database.ref(
          `profiles/${
            Firebase.auth().currentUser.uid
          }/activeChat/${
            this.props.chatId
          }`
        ).set({
          '.value': true,
          '.priority': -Date.now()
        });
      }
    })

    this.listener = this.ref.on('child_added', data => {
      if (data.exists()) {
        let message = data.val();
        this.setState({
          messages: [{
            _id: this.state.messages.length,
            text: message.message,
            createdAt: new Date(parseInt(data.key)),
            user: {
              _id: message.createdBy,
              name: message.createdBy
            }
          }, ...this.state.messages]
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('child_added', this.listener);
    this.activeChatListener && this.activeChatRef.off('value', this.activeChatListener);
  }

  onSend(messages) {
    for (let message of messages) {
      this.ref.update({
        [Date.now()]: {
          createdBy: Firebase.auth().currentUser.uid,
          message: message.text
        }
      });
    }
  }

  renderAvatar(message) {
    return (
      <Avatar
        showRank
        onPress={() => Actions.profile({
          uid: message.currentMessage.user._id
        })}
        size={36}
        uid={message.currentMessage.user._id} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title={this.props.title || 'Contest Chat'} />
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          renderAvatar={this.renderAvatar}
          user={{
            _id: Firebase.auth().currentUser.uid
          }} />
        <CloseFullscreenButton back />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
