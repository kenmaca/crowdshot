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
import GroupAvatar from '../../components/profiles/GroupAvatar';
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      dateClosed: null,
    };

    this.ref = Database.ref(
      `chats/${this.props.chatId}`
    );

    this.contestRef = Database.ref(
      `contests/${this.props.chatId}/createdBy`
    );

    // methods
    this.onSend = this.onSend.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.refresh = this.refresh.bind(this);

    // synchronous list of messages to prevent
    // race condition
    this.messages = {};
    this.messageLength = Object.keys(this.messages).length;
  }

  componentDidMount() {
    this.listener = this.ref.on('child_added', data => {
      if (data.exists()) {

        // record synchronously
        let message = data.val();
        this.messages[data.key] = {
          _id: Object.keys(this.messages).length,
          text: message.message,
          createdAt: new Date(parseInt(data.key)),
          user: {
            _id: message.createdBy,
            name: message.createdBy
          }
        };
      }
    });

    this.contestListener = this.contestRef.on(
      'value', data => data.exists() && this.setState({
        contestCreatedBy: data.val()
      })
    );

    // trigger refresh
    this.delay = setTimeout(this.refresh, 250, 500);
  }

  componentWillUnmount() {
    this.listener && this.ref.off('child_added', this.listener);
    this.contestListener && this.contestRef.off('value', this.contestListener);
    this.delay && clearTimeout(this.delay);
  }

  refresh(delay) {
    this.setState({
      messages: Object.values(this.messages)
    });

    // clear loader
    this.refs.title.clearLoader();

    // add to owner's subscribed list of chats only
    // if messages has grown
    let currentLength = Object.keys(this.messages).length;
    if (currentLength > this.messageLength) {
      this.messageLength = currentLength;
      this.subscribe();
    }

    // trigger future refresh
    this.delay = setTimeout(this.refresh, delay, delay)
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

  subscribe() {
    Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat/${
        this.props.chatId
      }`
    ).set({
      '.priority': -Date.now(),
      '.value': Date.now()
    });
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
        <TitleBar
          showLoader
          ref='title'
          title={this.props.title || 'Contest Chat'}>
          <GroupAvatar
            uids={[

              // include the contest owner if this Chat
              // is a contest chat
              ...new Set([
                this.state.contestCreatedBy,
                ...this.state.messages.map(
                  message => message.user._id
                )
              ].filter(uid => uid))
            ]}
            limit={5} />
        </TitleBar>
        <GiftedChat

          // resort each and every time
          messages={
            this.state.messages.sort(
              (a, b) => b.createdAt - a.createdAt
            )
          }
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
