import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Image
} from 'react-native';

import Photo from '../common/Photo';
import Database from '../../utils/Database';
import Avatar from './Avatar';

export default class ChatAvatar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      avatarList: ["6P2NtwmzQWh0opdbuy0JwqSgPR02"],
      initialized: false,
    }

    this.ref = Database.ref(
      `profiles`
    );
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props) {
    if (
      props.uids
      && (
        (props.uids != this.props.uids)
        || !this.state.initialized
      )
    ) {
      this.setState({
        avatars: props.uids
      });

    // prevent the same photoId to rerender
    } else if (
      props.uids
      && (
        (props.uids != this.props.uids)
        || !this.state.initialized
      )
    ) {

      // remove previous listener
      this.componentWillUnmount();
      // add new listener
      this.ref = Database.ref(
        `chats/${chatId}`
      );
      this.listener = this.ref.on('value', data => {
        if (data.exists()) {
          var avatar = Object.values(data.val())
          for (i=0;i<avatar.length;i++) {
            this.state.avatars[avatar[i].createdBy] = avatar[i].createdBy
          }
        }
      })
    }
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener)
  }

  render() {
    return (
      <View>
        {
          this.state.avatars && (
            <View>
              {
                this.props.length == 1
                ?
                <Avatar
                  style={styles.container}
                  outline
                  size={50}
                  uid={this.state.avatars[0]} />
                :
                <View>
                  {
                    this.props.length == 2
                    ?
                    <View style={[{flexDirection: 'row'}]}>
                      <Avatar
                        style={styles.left}
                        outline
                        size={25}
                        uid={this.state.avatars[0]} />
                      <View style={[{height: 25, width: 3, backgroundColor: 'white'}]}/>
                      <Avatar
                        style={styles.right}
                        outline
                        size={25}
                        uid={this.state.avatars[1]} />
                    </View>
                    :
                    <View>
                      {
                        this.props.length == 3
                        ?
                        <View style={styles.container}>
                          <View>
                            <View style={styles.mid}>
                              <Avatar
                                style={styles.left}
                                outline
                                size={25}
                                uid={this.state.avatars[0]} />
                            </View>
                            <View style={[{height: 3, width: 25, backgroundColor: 'white'}]}/>
                              <View style={[{flexDirection: 'row'}]}>
                                <Avatar
                                  style={styles.left}
                                  outline
                                  size={25}
                                  uid={this.state.avatars[1]} />
                                <View style={[{height: 25, width: 3, backgroundColor: 'white'}]}/>
                                <Avatar
                                  style={styles.right}
                                  outline
                                  size={25}
                                  uid={this.state.avatars[2]} />
                              </View>
                          </View>
                        </View>
                        :
                        <View style={styles.container}>
                          <View style={[{flexDirection: 'row'}]}>
                            <Avatar
                              style={styles.left}
                              outline
                              size={25}
                              uid={this.state.avatars[0]} />
                            <View style={[{height: 25, width: 3, backgroundColor: 'white'}]}/>
                              <Avatar
                                style={styles.right}
                                outline
                                size={25}
                                uid={this.state.avatars[1]} />
                          </View>
                          <View style={[{height: 3, width: 25, backgroundColor: 'white'}]}/>
                          <View style={[{flexDirection: 'row'}]}>
                            <Avatar
                              style={styles.left}
                              outline
                              size={25}
                              uid={this.state.avatars[2]} />
                            <View style={[{height: 25, width: 3, backgroundColor: 'white'}]}/>
                              <Avatar
                                style={styles.right}
                                outline
                                size={25}
                                uid={this.state.avatars[3]} />
                          </View>
                        </View>
                      }
                    </View>


                  }
                </View>
              }
            </View>
          )
        }
      </View>
    );
  }
}





const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topLeft: {
    height: 25,
    width:25,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'red'
  },
  topRight: {
    height: 25,
    width:25,
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  bottomLeft: {
    height: 25,
    width:25,
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  bottomRight: {
    height: 25,
    width:25,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  mid: {
    height: 25,
    width: 50,
    alignItems: 'center'
  }

});
