import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Image, InteractionManager
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import AppIntro from 'react-native-app-intro';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Video from 'react-native-video';

// consts
let gradient = [
  Colors.Gradient6,
  Colors.Gradient5,
  Colors.Gradient4,
  Colors.Gradient3,
  Colors.Gradient2,
  Colors.Gradient2
];

// animatable
let AnimatableImage = Animatable.createAnimatableComponent(Image);

export default class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.onSlideChange = this.onSlideChange.bind(this);
    this.complete = this.complete.bind(this);
  }

  onSlideChange(i, total) {
    switch(i) {
      case 0:

        // image maximized
        this.refs.imageContainer.transitionTo({
          opacity: 1,
          top: 0,
          left: 0
        });
        this.refs.image.transitionTo({
          width: Sizes.Width * 2 * 0.97,
          height: Sizes.Width * 2,
        });
        break;
      case 1:

        // image centered
        this.refs.imageContainer.transitionTo({
          opacity: 1,
          top: Sizes.InnerFrame * 2,
          left: Sizes.InnerFrame * 1.5
        });
        this.refs.image.transitionTo({
          width: Sizes.Width * 0.9 * 0.97,
          height: Sizes.Width * 0.9
        });

        // video hidden
        this.refs.video.transitionTo({
          opacity: 0
        });
        break;
      case 2:

        // image hidden
        this.refs.imageContainer.transitionTo({
          opacity: 0
        });

        // video visible
        this.refs.video.transitionTo({
          opacity: 1
        });
        break;
      case 3:

        // reached the end -- move to Login
        this.complete();
        break;
    }
  }

  complete() {

    // expand the ball
    this.refs.ball.transitionTo({
      width: Sizes.Height * 4,
      height: Sizes.Height * 4,
      borderRadius: Sizes.Height * 2
    }, 500, 'ease-in');
    this.refs.ballContainer.transitionTo({
      bottom: -Sizes.OuterFrame * 2
    }, 500, 'ease-in');

    // now move to Login when animation ends
    // TODO: wait for callback from Animatable to
    // be implemented
    InteractionManager.runAfterInteractions(Actions.login);
  }

  render() {
    return (
      <View style={styles.container}>
        <Animatable.View
          animation='fadeIn'
          style={styles.container}>
          <Animatable.View
            ref='imageContainer'
            style={styles.imageContainer}>
            <AnimatableImage
              ref='image'
              source={require(
                '../../../res/img/onboarding/1d.png'
              )}
              style={styles.image} />
          </Animatable.View>
          <Animatable.View
            ref='video'
            style={[
              styles.video,
              {
                opacity: 0
              }
            ]}>
            <Video
              repeat
              muted
              resizeMode='cover'
              style={styles.video}
              source={require('../../../res/img/header.mp4')} />
            <View style={styles.videoOverlay} />
          </Animatable.View>
          <AppIntro
            onSlideChange={this.onSlideChange}
            onSkipBtnClick={this.complete}
            skipBtnLabel={(
              <Text style={styles.button}>
                Skip
              </Text>
            )}
            nextBtnLabel={(
              <Text style={styles.button}>
                Next
              </Text>
            )}
            doneBtnLabel={(
              <Text style={styles.button}>
                Done
              </Text>
            )}>
            <View style={styles.page}>
              <View level={-10}>
                <Text style={styles.text}>
                  Welcome to Crowdshot
                </Text>
              </View>
              <View level={-15}>
                <Text style={[
                  styles.text,
                  styles.description
                ]}>
                  Your nicest photos are taken by other people
                </Text>
              </View>
            </View>
            <View style={styles.page}>
              <View level={-10}>
                <Text style={styles.text}>
                  Introducing photo contests
                </Text>
              </View>
              <View level={-15}>
                <Text style={[
                  styles.text,
                  styles.description
                ]}>
                  Set a bounty for the type of photo you want and
                  watch nearby photographers worry about framing
                  the perfect shot
                </Text>
              </View>
              <View level={-5}>
                <Text style={[
                  styles.text,
                  styles.description
                ]}>
                  You do you — We'll handle the rest
                </Text>
              </View>
            </View>
            <View style={styles.page}>
              <View level={5}>
                <Text style={styles.text}>
                  Not interested in photos?
                </Text>
              </View>
              <View level={15}>
                <Text style={[
                  styles.text,
                  styles.description
                ]}>
                  Participate in photo contests nearby
                </Text>
              </View>
              <View level={10}>
                <Text style={[
                  styles.text,
                  styles.description
                ]}>
                  Make some serious money by using the camera
                  on your smartphone
                </Text>
              </View>
            </View>
            <View style={[
              styles.page,
              styles.last
            ]}>
              <View />
            </View>
          </AppIntro>
          <Animatable.View
            ref='ballContainer'
            style={styles.ballContainer}>
            <Animatable.View
              ref='ball'
              style={styles.ball} />
          </Animatable.View>
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Background
  },

  button: {
    fontSize: Sizes.H4,
    fontWeight: '100'
  },

  page: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    margin: Sizes.OuterFrame,
    marginRight: Sizes.OuterFrame * 4,
    marginBottom: Sizes.OuterFrame * 5,
    backgroundColor: Colors.Transparent
  },

  last: {
    margin: 0,
    marginRight: 0,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  text: {
    fontSize: Sizes.H1,
    color: Colors.Text,
    backgroundColor: Colors.Transparent
  },

  description: {
    fontSize: Sizes.H2,
    fontWeight: '100',
    marginBottom: Sizes.InnerFrame
  },

  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Sizes.Width,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  image: {
    width: Sizes.Width * 2 * 0.97,
    height: Sizes.Width * 2,
    tintColor: Colors.Primary
  },

  ballContainer: {
    position: 'absolute',
    bottom: -Sizes.Height * 2,
    width: Sizes.Width,
    alignItems: 'center',
    justifyContent: 'center'
  },

  ball: {
    width: Sizes.Height * 2,
    height: Sizes.Height * 2,
    borderRadius: Sizes.Height,
    backgroundColor: Colors.Primary
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Sizes.Width,
    height: Sizes.Height
  },

  videoOverlay: {
    flex: 1,
    backgroundColor: Colors.Overlay
  }
});
