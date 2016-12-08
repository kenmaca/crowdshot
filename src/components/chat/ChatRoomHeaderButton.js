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
    };

    // all refs keyed by id
    // to {ref: Reference, listener: Listener, unread: int}
    this.ref = {};
    this.rootRef = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/activeChat`
    );
  }

  componentDidMount() {
    this.rootListener = this.rootRef.on(
      'value', chats => {
        if (chats.exists()) {

          // reset count since new data incoming
          this.componentWillUnmount(true);

          // now, check chats for individual unread
          let blob = chats.val();
          Object.keys(blob).map(chatId => {

            // start up a new listener for that chat
            this.ref[chatId] = {unread: 0};
            this.ref[chatId].ref = Database.ref(
              `chats/${chatId}`
            );
            this.ref[chatId].listener = this.ref[chatId].ref.on(
              'value', data => {
                if (data.exists()) {

                  // reset unread for this chat
                  this.ref[chatId].unread = 0;
                  Object.keys(data.val()).map(date => {
                    if (date > blob[chatId]) {

                      // update unread synchronously to prevent
                      // out of order updates
                      this.ref[chatId].unread++;
                      this.setState({

                        // always retotal each time
                        unread: Object.values(this.ref).map(
                          chat => chat.unread
                        ).reduce((a, b) => a + b, 0)
                      });
                    }
                  });
                }
              }
            );
          });
        }
      }
    );
  }

  componentWillUnmount(reset) {
    Object.values(this.ref).map(ref => {
      ref.ref.off('value', ref.listener);
    });

    // and reset if not actually unmounting
    if (reset) {
      this.ref = {};
    } else {
      this.rootListener && this.rootRef.off('value', this.rootListener);
    }
  }

  render() {
    return (
      <HeaderButton
        {...this.props}
        unread={this.state.unread} />
    )
  }
}
