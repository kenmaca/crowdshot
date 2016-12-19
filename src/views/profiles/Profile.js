import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text
} from 'react-native';
import Database from '../../utils/Database';
import {
  Sizes, Colors
} from '../../Const';
import DateFormat from 'dateformat';

// components
import Photo from '../../components/common/Photo';
import OutlineText from '../../components/common/OutlineText';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Rank from '../../components/profiles/Rank';
import Divider from '../../components/common/Divider';
import {
  BlurView
} from 'react-native-blur';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};

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
    this.profileListener && this.ref.off('value', this.profileListener);
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
        <Photo
          photoId={this.state.photo}
          style={styles.cover}>
          <View style={styles.coverContent}>
            <View style={styles.verticalBorder} />
            <View style={styles.headerContainer}>
              <View style={styles.rank}>
                <Rank
                  onlyLast
                  contestsWon={this.state.countWon}
                  size={12}
                  style={styles.rankText} />
              </View>
              <View style={styles.summary}>
                <Text style={styles.name}>
                  {
                    this.state.displayName
                    ? this.state.displayName.split(' ')[0]
                    : 'Unknown'
                  }
                </Text>
                <Text style={styles.subtitle}>
                  Founder at Crowdshot
                </Text>
              </View>
            </View>
          </View>
        </Photo>
        <View style={styles.stats}>
          <View style={styles.statsBox}>
            <View style={[
              styles.statsContainer,
              styles.statsLeft
            ]}>
              <Text style={styles.stat}>
                239
              </Text>
              <Text style={styles.statName}>
                Contests Won
              </Text>
            </View>
            <View style={[
              styles.statsContainer,
              styles.statsRight
            ]}>
              <Text style={styles.stat}>
                49
              </Text>
              <Text style={styles.statName}>
                Contests Started
              </Text>
            </View>
          </View>
          <Divider
            color={Colors.LightWhiteOverlay} />
          <View style={styles.statsBox}>
            <View style={[
              styles.statsContainer,
              styles.statsLeft
            ]}>
              <Text style={styles.stat}>
                Hi, my name is Kenneth and I've got lots to say, so listen up. This is a really long line. And I have even more to say, so please don't stop listening to me. Okay, bye.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.boxes}>
          <View style={styles.box}>

          </View>
          <View style={styles.box} />
        </View>
        <CloseFullscreenButton
          back
          color={Colors.MediumWhiteOverlay}
          style={styles.closeButton} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  cover: {
    alignSelf: 'stretch',
    height: Sizes.Height * 0.45
  },

  coverContent: {
    flex: 1,
    backgroundColor: Colors.MediumDarkOverlay,
    justifyContent: 'space-between'
  },

  verticalBorder: {
    marginLeft: Sizes.OuterFrame * 5,
    height: Sizes.OuterFrame * 7,
    borderLeftColor: Colors.LightWhiteOverlay,
    borderLeftWidth: 1
  },

  headerContainer: {
    flexDirection: 'row',
    marginBottom: Sizes.OuterFrame
  },

  rank: {
    marginLeft: Sizes.OuterFrame * 2.75,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.LightWhiteOverlay
  },

  rankText: {
    top: -3,
    left: 1
  },

  summary: {
    marginLeft: Sizes.InnerFrame
  },

  name: {
    fontSize: Sizes.H2 * 1.2,
    fontWeight: '300',
    color: Colors.WhiteOverlay
  },

  subtitle: {
    fontSize: Sizes.Text,
    fontWeight: '400',
    color: Colors.MediumWhiteOverlay
  },

  stats: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: Colors.Primary
  },

  statsBox: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: Sizes.OuterFrame * 5,
    alignItems: 'center'
  },

  statsContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  statsLeft: {
    marginRight: Sizes.InnerFrame * 2
  },

  statsRight: {
    paddingLeft: Sizes.OuterFrame,
    borderLeftWidth: 1,
    borderLeftColor: Colors.LightWhiteOverlay
  },

  stat: {
    fontSize: Sizes.Text,
    color: Colors.Text
  },

  statName: {
    fontSize: Sizes.SmallText,
    color: Colors.MediumWhiteOverlay
  },

  boxes: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: Sizes.Width / 2,
    backgroundColor: Colors.Foreground
  },

  box: {
    width: Sizes.Width / 2,
    height: Sizes.Width / 2
  },

  closeButton: {
    left: Sizes.OuterFrame * 2
  }
});
