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
import DateFormat from 'dateformat';

// components
import InformationField from '../../components/common/InformationField';
import LinearGradient from 'react-native-linear-gradient';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Photo from '../../components/common/Photo';
import Avatar from '../../components/profiles/Avatar';
import OutlineText from '../../components/common/OutlineText';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Rank from '../../components/profiles/Rank';
import {
  BlurView
} from 'react-native-blur';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.ref = Database.ref(`profiles/${this.props.uid}`);
  }

  componentDidMount() {
    this.profileListener = this.ref.on('value', data => {
      data.exists() && this.setState({
        ...data.val()
      });
    })
  }

  componentWillUnmount() {
    this.ref.off('value', this.profileListener);
  }

  render() {

    // used to build stats
    let completed = this.state.completedContests || {};
    let cancelled = this.state.cancelledContests || {};
    let contests = {
      ...completed,
      ...cancelled,
      ...(
        this.state.contests || {}
      )
    };

    let cancelledRate = (
      Object.keys(contests).length > 0
      ? +(
        (
          Object.keys(cancelled).length / Object.keys(contests).length
        ).toFixed(2)
      ): 0
    );

    return (
      <View style={styles.container}>
        <ParallaxScrollView
          parallaxHeaderHeight={Sizes.Height * 0.3}
          contentBackgroundColor={Colors.Background}
          fadeOutForeground={false}
          renderBackground={() => (
            <Photo
              photoId={this.state.photo}
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
              <Rank
                size={Sizes.Text}
                contestsWon={this.state.countWon} />
            </View>
          )}>
          <View style={styles.body}>
            <View style={styles.topContainer}>
              <Text style={styles.name}>
                {this.state.displayName || 'Somebody'}
              </Text>
              <Avatar
                outline
                size={100}
                uid={this.props.uid} />
            </View>
            <InformationField
              isTop
              label='Region'
              info={this.state.currentRegion || 'Unknown'} />
            <InformationField
              isBottom
              label='Join Date'
              info={
                this.state.dateCreated
                ? DateFormat(this.state.dateCreated, 'mmmm dS, yyyy')
                : 'Unknown'
              } />
            <InformationField
              isTop
              label='Contests Won'
              info={this.state.countWon || 0} />
            <InformationField
              isBottom
              label='Contests Entered'
              info={this.state.countAttempts || 0} />
            <InformationField
              isTop
              label='Contests Hosted'
              info={Object.keys(contests).length || 0} />
            <InformationField
              isBottom
              label='Contest Completion Rate'
              info={`${Math.round((1 - cancelledRate) * 100)}%`} />
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
    marginRight: Sizes.OuterFrame,
    marginLeft: Sizes.OuterFrame,
    marginBottom: Sizes.InnerFrame
  },

  body: {
    top: -Sizes.InnerFrame * 4,
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
  }
});
