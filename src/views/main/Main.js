import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Animated, PanResponder,
  ListView, TouchableOpacity
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
let panDiff = 120;
let AnimatedListView = Animated.createAnimatedComponent(
  ListView
);
let AnimatedView = Animated.createAnimatedComponent(View);

// components
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Avatar from '../../components/profiles/Avatar';
import OutlineText from '../../components/common/OutlineText';
import ContestCard from '../../components/lists/ContestCard';
import EmptyContestCard from '../../components/lists/EmptyContestCard';
import CircleIcon from '../../components/common/CircleIcon';
import HeaderButtons from '../../components/common/HeaderButtons';
import HeaderButton from '../../components/common/HeaderButton';

export default class Main extends Component {
  constructor(props) {
    super(props);

    let pan = new Animated.ValueXY();
    let rawData = [false];
    this.state = {
      isDocked: true,
      pan: pan,
      rawData: rawData,
      data: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(rawData),
      animation: pan.y.interpolate({
        inputRange: [-panDiff, 0],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      }),
      displayName: 'Unknown'
    };

    // bindings
    this.getListViewStyle = this.getListViewStyle.bind(this);
    this.getPaddingStyle = this.getPaddingStyle.bind(this);

    // determine which header and greeting to display based
    // on time
    let isEvening = DateFormat(Date.now(), 'TT') == 'PM';
    this.state.headerVideo = (
      isEvening ?
      require('../../../res/img/evening2.mp4')
      : require('../../../res/img/header.mp4')
    );
    this.state.headerGreeting = (
      isEvening
      ? 'Good evening, '
      : 'Good afternoon, '
    );

    // PanResponder setup
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (
        evt, gestureState
      ) => true,
      onStartShouldSetPanResponderCapture: (
        evt, gestureState
      ) => true,
      onMoveShouldSetPanResponder: (
        evt, gestureState
      ) => (
        (gestureState.dy < (-panDiff / 6))
        || (gestureState.dy > (panDiff / 6))
      ),
      onMoveShouldSetPanResponderCapture: (
        evt, gestureState
      ) => (
        (gestureState.dy < (-panDiff / 6))
        || (gestureState.dy > (panDiff / 6))
      ),
      onPanResponderGrant: () => {},
      onPanResponderMove: Animated.event(
        [null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y
        }]
      ),
      onPanResponderRelease: (evt, gestureState) => {
        let shouldToggle = (
          this.state.isDocked
          ? (gestureState.dy < (-panDiff / 3))
          : (gestureState.dy > (panDiff / 3))
        );

        if (!shouldToggle) {

          // return to original position
          Animated.spring(
            this.state.pan.y,
            {toValue: 0}
          ).start();
        } else {

          // toggle between docked and zoomed
          Animated.spring(
            this.state.pan.y,
            {
              toValue: (
                this.state.isDocked
                ? -panDiff
                : panDiff
              )
            }
          ).start(() => {
            this.setState({
              isDocked: !this.state.isDocked,
              animation: (
                !this.state.isDocked
                ? this.state.pan.y.interpolate({
                  inputRange: [-panDiff, 0],
                  outputRange: [0, 1],
                  extrapolate: 'clamp'
                })
                : this.state.pan.y.interpolate({
                  inputRange: [0, panDiff],
                  outputRange: [0, 1],
                  extrapolate: 'clamp'
                })
              )
            });
          });
        }
      }
    });

    // data
    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/contests`
    );
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
      if (data.exists()) {
        let rawData = [...Object.keys(data.val()), false];
        this.setState({
          rawData: rawData,
          data: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          }).cloneWithRows(rawData)
        });
      }
    });

    // profile
    Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/displayName`
    ).once('value', data => data.exists() && this.setState({
      displayName: data.val()
    }));
  }

  notificationResponder(notification, initial) {
    if (notification) {

      // if from tray or initial load, then react to it
      if (notification.opened_from_tray || initial) {
        switch(notification['gcm.notification.type']) {
          case 'contestNearby':
            Actions.mainContestant();
            break;
          case 'contestWinner':
            Actions.contestStatus({
              contestId: notification.contestId
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
  }

  getListViewStyle() {
    return {
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
          translateX: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.8],
            extrapolate: 'clamp'
          })
        }, {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Sizes.Height / 2],
            extrapolate: 'clamp'
          })
        }
      ]
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Video
            repeat
            muted
            resizeMode='cover'
            source={this.state.headerVideo}
            style={styles.cover} />
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
                this.state.headerGreeting
              }{
                this.state.displayName.split(' ')[0]
              }.
            </Text>
            <OutlineText
              style={styles.location}
              text={
                `${
                  this.state.rawData.length - 1
                } Active Contests`
              } />
          </LinearGradient>
          <View style={styles.arrowContainer}>
            <CircleIcon
              style={styles.arrow}
              size={Sizes.H1 * 2}
              icon='keyboard-arrow-up'
              checkColor={Colors.LightWhiteOverlay}
              color={Colors.Transparent} />
            <Text style={styles.arrowText}>
              SLIDE UP
            </Text>
          </View>
        </View>
        <AnimatedListView
          horizontal
          pagingEnabled
          removeClippedSubviews={false}
          dataSource={this.state.data}
          style={this.getListViewStyle()}
          {...this._panResponder.panHandlers}
          renderRow={
            rowData => {
              return (
                rowData
                ? (
                  <View
                    key={rowData}
                    style={styles.cardShadow}>
                    <View style={styles.cardContainer}>
                      <ContestCard
                        isCard
                        contestId={rowData} />
                    </View>
                  </View>
                ): (
                  <View
                    key={'emptyCard'}
                    style={styles.cardShadow}>
                    <EmptyContestCard />
                  </View>
                )
              );
            }
          } />
        <HeaderButtons>
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
    minHeight: Sizes.Height * 0.6,
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
    marginTop: -Sizes.Height * 0.6,
    height: Sizes.Height * 0.6,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Sizes.InnerFrame
  },

  arrowContainer: {
    marginTop: -Sizes.InnerFrame * 10,
    alignItems: 'center',
  },

  arrow: {
    
  },

  arrowText: {
    marginTop: -Sizes.InnerFrame * 0.5,
    textAlign: 'center',
    fontSize: Sizes.SmallText,
    color: Colors.LightWhiteOverlay,
    backgroundColor: Colors.Transparent
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
  if (user) {
    Database.ref(
      `profiles/${
        user.uid
      }/fcm`
    ).set(token);
  }
}
