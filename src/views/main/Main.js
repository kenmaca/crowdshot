import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Animated, PanResponder,
  ListView, TouchableOpacity, Easing, Platform
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import DateFormat from 'dateformat';
import FCM from 'react-native-fcm';

// modifications
let panDiff = 160;
let AnimatedListView = Animated.createAnimatedComponent(
  ListView
);

// components
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Avatar from '../../components/profiles/Avatar';
import OutlineText from '../../components/common/OutlineText';
import ContestCard from '../../components/lists/ContestCard';
import CircleIcon from '../../components/common/CircleIcon';
import HeaderButtons from '../../components/common/HeaderButtons';
import HeaderButton from '../../components/common/HeaderButton';
import ChatRoomHeaderButton from '../../components/chat/ChatRoomHeaderButton';

export default class Main extends Component {
  constructor(props) {
    super(props);
    let pan = new Animated.Value(0);
    let rawData = [false];
    this.state = {
      scrollAllowed: true,
      isDocked: true,
      pan: pan,
      rawData: rawData,
      data: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(rawData),
      animation: pan.interpolate({
        inputRange: [-panDiff, 0],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      }),
      displayName: 'Unknown'
    };

    // bindings
    this.getListViewStyle = this.getListViewStyle.bind(this);
    this.getPaddingStyle = this.getPaddingStyle.bind(this);
    this.top = this.top.bind(this);
    this.bottom = this.bottom.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.updateBackground = this.updateBackground.bind(this);

    // PanResponder setup
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {

        // trigger that we've interally captured the
        // PanResponder
        this.shouldCapture = (
          gestureState.dx > -10
          && gestureState.dx < 10
          && (
            (
              this.state.isDocked
              && gestureState.dy < -1
            ) || (
              !this.state.isDocked
              && gestureState.dy > 1
            )
          )
        );

        return this.shouldCapture;
      },
      onPanResponderGrant: () => {

        // only act if we've been internally granted
        // by *this* onMoveShouldSetPanResponderCapture
        // and not the built in ListView's
        if (this.shouldCapture && this.state.scrollAllowed) {
          this.setState({
            scrollAllowed: false
          });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        this.shouldCapture && Animated.event(
          [null, {
            dy: this.state.pan
          }]
        )(evt, gestureState);
      },
      onPanResponderRelease: (
        evt, gestureState
      ) => {
        if (this.shouldCapture) {
          if (
            this.state.isDocked
            && (gestureState.dy < (-panDiff / 3))
          ) {
            this.top();
          } else if (gestureState.dy > (panDiff / 3)) {
            this.bottom();
          } else {
            Animated.timing(
              this.state.pan,
              {
                toValue: 0,
                duration: 100,
                easing: Easing.inOut(Easing.ease)
              }
            ).start(() => this.setState({
              scrollAllowed: true
            }));
          }

          // scroll to snapped page
          this.refs.cards._component.scrollTo({
            x: this.currentPage * this.offset
          });
        }

        // reset
        this.shouldCapture = false;
      }
    });

    // data
    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/contests`
    );
  }

  updateBackground() {

    // determine the hour
    switch(+DateFormat(Date.now(), 'HH')) {
      case 0: case 1: case 2: case 3: case 4: case 5:
        this.setState({
          headerGreeting: 'Party time, ',
          headerVideo: require('../../../res/img/late.mp4')
        });
        break;
      case 6: case 7: case 8: case 9: case 10: case 11:
        this.setState({
          headerGreeting: 'Good morning, ',
          headerVideo: require('../../../res/img/morning.mp4')
        });
        break;
      case 12: case 13: case 14: case 15: case 16: case 17:
        this.setState({
          headerGreeting: 'Good afternoon, ',
          headerVideo: require('../../../res/img/afternoon.mp4')
        });
        break;
      case 18: case 19: case 20: case 21: case 22: case 23:
        this.setState({
          headerGreeting: 'Good evening, ',
          headerVideo: require('../../../res/img/evening.mp4')
        });
        break;
    }

    // trigger future update in a hour
    this.update = setTimeout(this.updateBackground, 3600000);
  }

  componentWillReceiveProps(props) {
    props.toggle && this.bottom();
  }

  componentDidMount() {

    // initialize FCM
    FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
      updateFCMToken(token);
    });
    this.token = FCM.on('refreshToken', token => {
      updateFCMToken(token);
    });

    // load first notification if present
    FCM.getInitialNotification().then(n =>
      this.notificationResponder(n, true)
    );

    // FCM listeners
    this.notification = FCM.on(
      'notification',
      this.notificationResponder
    );

    // data
    this.listener = this.ref.on('value', data => {

      // dont check exists due to last item being removed
      let rawData = Object.keys(data.val() || {});
      this.setState({
        rawData: rawData,
        data: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        }).cloneWithRows(rawData)
      });
    });

    // profile
    Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/displayName`
    ).once('value', data => data.exists() && this.setState({
      displayName: data.val()
    }));

    // update background greeting
    this.updateBackground();
  }

  notificationResponder(notification, initial) {
    if (notification) {

      // if from tray or initial load, then react to it
      if (notification.opened_from_tray || initial) {
        switch(notification.type) {
          case 'contestNearby':
            Actions.mainContestant();
            break;
          case 'contestWinner':
            Actions.contestStatus({
              contestId: notification.contestId
            });
            break;
          case 'chatNotification':
            Actions.chat({
              chatId: notification.chatId
            });
            break;
          default:
            break;
        }
      }
    }
  }

  componentWillUnmount() {
    this.token();
    this.notification();
    this.listener && this.ref.off('value', this.listener);
    this.update && clearTimeout(this.update);
  }

  getListViewStyle() {
    return Platform.OS === 'ios' ?
    {
      flex: 1,
      alignSelf: 'stretch',
      width: Sizes.Width,
      overflow: 'visible',
      transform: [
        {
          scale: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.8],
            extrapolate: 'clamp'
          }),
        }, {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Sizes.Height / 2],
            extrapolate: 'clamp'
          })
        }
      ]
    } : {
      flex: 1,
      alignSelf: 'center',
      width: this.state.animation.interpolate({
          inputRange: [0, 1],
          outputRange: [Sizes.Width, Sizes.Width /0.8],
          extrapolate: 'clamp'
        }),
      transform: [
        {
          scale: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.8],
            extrapolate: 'clamp'
          }),
        }, {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Sizes.Height / 2],
            extrapolate: 'clamp'
          })
        }
      ],
    };
  }

  getPaddingStyle() {
    return {
      width: this.state.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Sizes.Width / 2.6]
      })
    }
  }

  top() {
    Animated.timing(
      this.state.pan,
      {
        toValue: -panDiff,
        duration: 100,
        easing: Easing.inOut(Easing.ease)
      }
    ).start(() => {
      this.setState({
        animation: this.state.pan.interpolate({
          inputRange: [0, panDiff],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        }),
        isDocked: false,
        scrollAllowed: true
      });
    });
  }

  bottom() {
    Animated.timing(
      this.state.pan,
      {
        toValue: panDiff,
        duration: 100,
        easing: Easing.inOut(Easing.ease)
      }
    ).start(() => {
      this.setState({
        animation: this.state.pan.interpolate({
          inputRange: [-panDiff, 0],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        }),
        isDocked: true,
        scrollAllowed: true
      });
    });
  }

  onLayout(e) {
    this.offset = e.nativeEvent.layout.width;
  }

  onScroll(e) {
    this.currentPage = Math.round(
      e.nativeEvent.contentOffset.x / this.offset
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {
            this.state.headerVideo && (
              <Video
                repeat
                muted
                resizeMode='cover'
                source={this.state.headerVideo}
                style={styles.cover} />
            )
          }
          <LinearGradient
            colors={[
              Colors.Transparent,
              Colors.Transparent,
              Colors.Background,
            ]}
            style={styles.headerContent}>
            <Avatar
              size={30}
              onPress={() => Actions.profile({
                uid: Firebase.auth().currentUser.uid
              })}
              uid={Firebase.auth().currentUser.uid} />
            <Text style={styles.welcomeTitle}>
              {
                `${
                  this.state.headerGreeting || 'Welcome back, '
                } ${
                  this.state.displayName.split(' ')[0]
                }.`
              }
            </Text>
            <OutlineText
              style={styles.location}
              text={
                `${
                  this.state.rawData.length
                } Active Contests`
              } />
          </LinearGradient>
        </View>
        <AnimatedListView
          ref='cards'
          horizontal
          pagingEnabled={Platform.OS === 'ios'}
          enableEmptySections
          scrollEnabled={this.state.scrollAllowed}
          removeClippedSubviews={true}
          dataSource={this.state.data}
          onLayout={this.onLayout}
          onScroll={this.onScroll}
          style={this.getListViewStyle()}
          {...this._panResponder.panHandlers}
          renderRow={
            rowData => {
              return (
                <View
                  key={rowData}
                  style={styles.cardShadow}>
                  <View style={styles.cardContainer}>
                    <ContestCard
                      isCard
                      toggle={
                        this.state.isDocked
                        ? this.top: this.bottom
                      }
                      contestId={rowData} />
                  </View>
                </View>
              );
            }
          } />
        <HeaderButtons>
          <HeaderButton
            icon='report'
            onPress={Actions.report} />
          <ChatRoomHeaderButton
            icon='chat-bubble'
            onPress={Actions.chatroom} />
          <HeaderButton
            icon='photo-library'
            onPress={Actions.completed} />
          <HeaderButton
            fontAwesome
            icon='sliders'
            onPress={Actions.settings} />
        </HeaderButtons>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },

  header: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: Sizes.Width,
    height: Sizes.Height,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  cover: {
    minHeight: Sizes.Height * 0.7,
    alignSelf: 'stretch'
  },

  welcomeTitle: {
    width: Sizes.Width * 0.7,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.Text,
    backgroundColor: Colors.Transparent,
    textAlign: 'center'
  },

  location: {
    marginTop: Sizes.OuterFrame
  },

  headerContent: {
    marginTop: -Sizes.Height * 0.75,
    height: Sizes.Height * 0.75,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Sizes.InnerFrame
  },

  cardShadow: {
    borderRadius: 5,
    marginTop: Sizes.InnerFrame / 4,
    marginLeft: Sizes.InnerFrame / 4,
    marginRight: Sizes.InnerFrame / 4,
    shadowColor: Colors.DarkOverlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },

  cardContainer: {
    flex: 1,
    width: Sizes.Width - Sizes.InnerFrame / 2,
    borderRadius: 5,
    overflow: 'hidden'
  }
});

export function updateFCMToken(token) {

  // only update when logged in
  let user = Firebase.auth().currentUser;
  if (user && token) {
    Database.ref(
      `profiles/${
        user.uid
      }/fcm`
    ).set(token);
  }
}
