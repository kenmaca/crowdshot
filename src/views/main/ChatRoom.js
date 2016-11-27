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
      })
    };

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat`
    );
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
          <ChatCard chatId={contestId} />
      </Swipeout>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          title='Your Contest Chat Room' />
        <View style={styles.content}>
          <ListView
            key={Math.random()}
            scrollEnabled
            dataSource={this.state.activeChat}
            style={styles.activeChat}
            renderRow={this.renderRow.bind(this)} />
        </View>
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
  }
})
