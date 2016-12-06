import React, {
  Component
} from 'react';

import Database from '../../utils/Database';
import * as Firebase from 'firebase';
import HeaderButton from '../common/HeaderButton';

export default class ChatRoomHeaderButton extends Component {

    constructor(props) {
      super(props);

      this.state = {
        unread: 0
      }
    }

    componentDidMount() {
      //get all the activeChat Ids
      Database.ref(
        `profiles/${
          Firebase.auth().currentUser.uid
        }/activeChat`
      ).on('value', chatId => {
        if (chatId.exists()) {
          var ids = Object.keys(chatId.val());
          //get the latest chat closed time
          //get the number of unread messages
          ids.map(id => {
            Database.ref(
              `profiles/${
                Firebase.auth().currentUser.uid
              }/activeChat/${id}`
            ).once('value', date => {
              Database.ref(
                `chats/${id}`
              ).on('value', data => {
                if (data.exists()) {
                  let blob = Object.keys(data.val())
                  blob.map(i => {
                    if (i > date.val()) {
                      this.setState({
                        unread: this.state.unread + 1
                      })
                    }
                  })
                }
              })
            })
          })
        }
      })
    }

  render() {
    return (
      <HeaderButton
        {...this.props}
        unread={this.state.unread} />
    )
  }
}
