import React, {
  Component
} from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import Photo from '../common/Photo';
import CircleIconInfo from '../common/CircleIconInfo';
import Avatar from '../profiles/Avatar';
import ChatAvatar from '../profiles/ChatAvatar';

export default class ChatCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contest: {},
      avatarList: {}

    }

    this.ref = Database.ref(
      `contests/${
        this.props.chatId
      }`
    )

    this.chatRef = Database.ref(
      `chats/${
        this.props.chatId
      }`
    )

    this.nameRef = Database.ref(
      `profiles`
    )

  };

    componentDidMount() {
      this.listener = this.ref.on('value', data => {
        if (data.exists()) {
          this.setState({
            ...data.val()
          });
        }
      });

      this.chatListener = this.chatRef.limitToLast(1).on('value', data => {
        if (data.exists()) {
          var person = Object.values(data.val())[0].createdBy
          this.nameListener = this.nameRef.on('value', data => {
            data.exists() && this.setState({
              name: data.val()[person].displayName
            })
          });
          this.setState({
            message: Object.values(data.val())[0].message,
            time: Object.keys(data.val())[0],
          })
        }
      });


      this.avatarListener = this.chatRef.on('value', data => {
        if (data.exists()){
          var avatar = Object.values(data.val())
          avatar.map(i => {
            this.state.avatarList[i.createdBy] = i.createdBy
          })
          this.setState({
            avatarList: this.state.avatarList
          })
        }
      })
    }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.avatarListener && this.chatRef.off('value', this.avatarListener);
    this.chatListener && this.chatRef.off('value', this.chatListenser);
    this.nameListener && this.nameRef.off('value', this.nameListener);

  }

  formattedMessage(message, length) {
    var fmsg = message + "";
    if (fmsg.length > length) {
      var res = fmsg.substr(0, length) + ' ...';
      return res;
    }
    return message
  }

  render() {
    // let avatars =
      return(
      <View style={styles.outline}>
        <TouchableOpacity
          onPress={() => Actions.chat({
            chatId: this.props.chatId,
            title: 'Contest Chat'
          })}>
          <View style={styles.item}>
            <View style={styles.avatar}>
              <ChatAvatar
                uids={Object.keys(this.state.avatarList)}
                length={Object.keys(this.state.avatarList).length}/>
            </View>
            <View style={styles.messageContainer}>
              <Text style={styles.chatTitle}>
                {this.formattedMessage(this.state.near, 30)}
              </Text>
              <Text style={styles.message}>
                {this.state.name
                  + ': '
                  + this.formattedMessage(this.state.message, 30)}
              </Text>
            </View>
            <Text style={styles.date}>
              {this.formattedDate()}
            </Text>
            {
              this.props.unread > 0
              && (
                <View style={styles.unreadContainer}>
                  <Text style={styles.unread}>
                    {this.props.unread}
                  </Text>
                </View>
              )
            }
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  formattedDate() {

    //Within a day => time
    //Within a week => monday
    //Ow, date
    var date = new Date(Number(this.state.time));
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var week = date.getDay();
    // new Day
    var newDate = new Date();
    var newDay = newDate.getDay()
    //Within this week
    var res;
    //Yesterday
    if (week == newDay) {
      if (hour > 12) {
        // Todo: just-now to be added
        res = (hour-12) + ':' + ("0" + (minutes + 1)).slice(-2)  + ' PM'
      } else {
        res = hour + ':' + ("0" + (minutes + 1)).slice(-2) + ' AM'
      }
    } else if (week + 1 == newDay || (week == 6 && newDay == 0)) {
      res = 'Yesterday'
  } else if (newDay - week < 6) {
      //Which day of week
      if (week == 1) {
        res = 'Monday'
      } else if (week == 2) {
        res = 'Tuesday'
      } else if (week == 3) {
        res = 'Wednsday'
      } else if (week == 4) {
        res = 'Thursday'
      } else if (week == 5) {
        res = 'Friday'
      } else if (week == 6) {
        res = 'Satuday'
      } else if (week == 0) {
        res = 'Sunday'
      }
    } else {
      //month 2 digits
      month = ("0" + (month + 1)).slice(-2);

      year = year.toString();

      res = year + "-" + month + "-" + day;
    }
    return res;
  }
}

const styles = StyleSheet.create({
  outline: {
    alignSelf: 'stretch',
    borderLeftWidth: Sizes.InnerFrame / 4,
    borderLeftColor: Colors.ModalForeground,
    backgroundColor: Colors.ModalForeground
  },

  avatar: {
    marginLeft: 0
  },

  photo: {
    width: 50,
    height: 50,
    borderRadius: 5
  },

  item: {
    padding: Sizes.InnerFrame,
    paddingLeft: Sizes.InnerFrame,
    backgroundColor: Colors.ModalForeground,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },

  chatTitle: {
    fontSize: Sizes.Text,
    color: Colors.AlternateText,
    textAlign: 'left'
  },

  message: {
    fontSize: Sizes.H3,
    color: Colors.SubduedText,
    textAlign: 'left',
    fontStyle:'italic',
    paddingTop: 5
  },

  messageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: Sizes.InnerFrame
  },

  date: {
    color: Colors.AlternateText,
    fontSize: Sizes.Text
  },

  unreadContainer: {
    position: 'absolute',
    right: Sizes.InnerFrame,
    bottom: Sizes.InnerFrame,
    alignSelf: 'center',
    alignItems: 'center',
    padding: Sizes.InnerFrame / 4,
    paddingLeft: Sizes.InnerFrame,
    paddingRight: Sizes.InnerFrame,
    borderRadius: 50,
    backgroundColor: Colors.Cancel
  },

  unread: {
    fontSize: Sizes.SmallText,
    color: Colors.Text,
    fontStyle: 'italic',
    fontWeight: '900'
  }
})
