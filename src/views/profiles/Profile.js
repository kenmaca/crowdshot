import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text, Image
} from 'react-native';
import Database from '../../utils/Database';
import {
  Sizes, Colors
} from '../../Const';

// components
import InformationField from '../../components/common/InformationField';
import PhotoGrid from '../../components/common/PhotoGrid';
import LinearGradient from 'react-native-linear-gradient';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Photo from '../../components/common/Photo';
import Avatar from '../../components/profiles/Avatar';
import OutlineText from '../../components/common/OutlineText';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import {
  BlurView
} from 'react-native-blur';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {}
    };

    this.ref = Database.ref(`profiles/${this.props.uid}`);
  }

  componentDidMount() {
    this.profileListener = this.ref.on('value', data => {
      data.exists() && this.setState({
        profile: data.val()
      });
    })
  }

  componentWillUnmount() {
    this.ref.off('value', this.profileListener);
  }

  render() {
    console.log(this.state.profile.photo);
    return (
      <View style={styles.container}>
        <ParallaxScrollView
          parallaxHeaderHeight={Sizes.Height * 0.3}
          contentBackgroundColor={Colors.Background}
          fadeOutForeground={false}
          renderBackground={() => (
            <Photo
              photoId={this.state.profile.photo}
              style={styles.cover}>
              <BlurView
                blurType='light'
                style={styles.blur}>
                <View style={[
                  styles.blur,
                  styles.blurTint
                ]} />
              </BlurView>
            </Photo>
          )}
          renderForeground={() => (
            <View style={styles.foreground}>
              <OutlineText text='Toronto, ON, Canada' />
            </View>
          )}>
          <View style={styles.body}>
            <View style={styles.topContainer}>
              <Text style={styles.name}>
                {this.state.profile.displayName}
              </Text>
              <Avatar
                outline
                size={100}
                uid={this.props.uid} />
            </View>
            <InformationField
              isTop
              label="Region"
              info="Toronto, ON" />
            <InformationField
              isBottom
              label="Age"
              info="18-29" />
          </View>
          <View style={styles.grid}>
            <PhotoGrid
              photoIds={
                this.state.profile.photos
                && Object.keys(this.state.profile.photos)
                || []
              }
              eachRow={3}
              width={Sizes.Width - Sizes.InnerFrame * 2 + 5} />
          </View>
        </ParallaxScrollView>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  headerContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },

  blur: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },

  blurTint: {
    backgroundColor: Colors.PrimaryOverlay
  },

  cover: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: Sizes.Height * 0.3
  },

  foreground: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: Sizes.OuterFrame,
    paddingBottom: Sizes.InnerFrame
  },

  topContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Sizes.InnerFrame * -4.5,
    marginRight: Sizes.OuterFrame,
    marginLeft: Sizes.OuterFrame,
    marginBottom: Sizes.InnerFrame
  },

  body: {
    marginTop: Sizes.InnerFrame
  },

  name: {
    marginBottom: Sizes.InnerFrame / 2,
    fontSize: 28,
    fontWeight: '600',
    color: Colors.Text
  },

  since: {
    textAlign: 'center',
    marginBottom: Sizes.OuterFrame
  },

  grid: {
    alignItems: 'center',
    marginBottom: Sizes.InnerFrame
  }
});
