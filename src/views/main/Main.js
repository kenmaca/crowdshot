import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Animated, PanResponder,
  ListView
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';

// modifications
let panDiff = 480;
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
import CircleIcon from '../../components/common/CircleIcon';

export default class Main extends Component {
  constructor(props) {
    super(props);

    let pan = new Animated.ValueXY();
    this.state = {
      isDocked: true,
      pan: pan,
      data: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      animation: pan.y.interpolate({
        inputRange: [-panDiff, 0],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      })
    };

    this.getListViewStyle = this.getListViewStyle.bind(this);
    this.getPaddingStyle = this.getPaddingStyle.bind(this);
  }

  componentWillMount() {

    // mock data
    this.setState({
      data: this.state.data.cloneWithRows([
        1, 2, 3, 4, 5, 6
      ])
    });

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
      ) => gestureState.dy !== 0,
      onMoveShouldSetPanResponderCapture: (
        evt, gestureState
      ) => gestureState.dy !== 0,
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
          : (gestureState.dy > (panDiff))
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
  }

  getListViewStyle() {
    return {
      flex: 1,
      width: this.state.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [Sizes.Width, Sizes.Width * 2],
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
          translateX: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -Sizes.Width / 2],
            extrapolate: 'clamp'
          }),
        }, {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Sizes.Height / 2],
            extrapolate: 'clamp'
          }),
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
            source={require('../../../res/img/header.mp4')}
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
              Good afternoon, Kenneth.
            </Text>
            <OutlineText
              style={styles.location}
              text='3 Active Contests' />
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
          pagingEnabled={!this.state.isDocked}
          dataSource={this.state.data}
          contentContainerStyle={styles.list}
          style={this.getListViewStyle()}
          {...this._panResponder.panHandlers}
          renderRow={
            (rowData, s, i) => {
              return (
                <View
                  key={i}
                  style={styles.cardShadow}>
                  <ContestCard />
                </View>
              );
            }
          } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  list: {
    alignItems: 'center'
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
    alignItems: 'center'
  },

  arrow: {
    marginBottom: -Sizes.InnerFrame * 1.5
  },

  arrowText: {
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
    }
  }
});
