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
      messages: [],
      dateClosed: null,
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

    this.updateTimeClosed = this.updateTimeClosed.bind(this);
  }

  componentDidMount() {
    this.activeChatListener = this.activeChatRef.on('value', data => {
      dateOpened = Date.now()
      if(!data.exists()) {
        //add to owner's list
        Database.ref(
          `profiles/${
            Firebase.auth().currentUser.uid
          }/activeChat/${
            this.props.chatId
          }`
        ).set({
          '.value': `${dateOpened}`,
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
    this.chatListener && this.ref.off('value', this.chatListener);
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

  updateTimeClosed() {
    // this.chatListener = this.ref.limitToLast(1).on('value', data => {
    //   console.log(Object.keys(data.val())[0])
    //   data.exists() && this.setState({
    //     dateClosed: Object.keys(data.val())[0]
    //   })
    // })
    Database.ref(
      `chats/${this.props.chatId}`).limitToLast(1).on('value', data => {
      data.exists && this.activeChatRef.set({
        '.value': Object.keys(data.val())[0]
      })
    })
    // this.state.dateClosed && this.activeChatRef.set({
    //   '.value': this.state.dateClosed
    // })
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
          {this.updateTimeClosed()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
