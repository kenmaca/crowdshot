import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text
} from 'react-native';
import Database from '../../utils/Database';
import {
  Sizes, Colors, Styles
} from '../../Const';
import DateFormat from 'dateformat';

// components
import Photo from '../../components/common/Photo';
import OutlineText from '../../components/common/OutlineText';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Rank from '../../components/profiles/Rank';
import Divider from '../../components/common/Divider';
import MapView from 'react-native-maps';
import {
  BlurView
} from 'react-native-blur';

// consts
const LAT_DELTA = 0.01;
const LNG_DELTA = 0.01;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {

        // default location is Toronto
        latitude: 43.6525,
        longitude: -79.381667,
        latitudeDelta: LAT_DELTA,
        longitudeDelta: LNG_DELTA,
      }
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
                  {
                    `Since ${
                      this.state.dateCreated
                      ? DateFormat(this.state.dateCreated, 'mmmm dS, yyyy')
                      : 'Unknown'
                    }`
                  }
                </Text>
                <OutlineText
                  text={this.state.currentRegion}
                  style={styles.region}
                  color={Colors.MediumWhiteOverlay} />
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
                {Object.keys(contests).length}
              </Text>
              <Text style={styles.statName}>
                Contests Started
              </Text>
            </View>
            <View style={[
              styles.statsContainer,
              styles.statsRight
            ]}>
              <Text style={styles.stat}>
                {
                  `${(
                    ((1 - cancelledRate) * 100).toFixed(0)
                  )}%`
                }
              </Text>
              <Text style={styles.statName}>
                Completion Rate
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
              <Text style={[
                styles.stat,
                styles.blurb
              ]}>
                
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.boxes}>
          <View style={styles.box}>
            <View style={styles.boxHorizontal}>
              <Photo
                photoId='-KY7Q56Aah4OkmG8zs-S'
                style={styles.boxVertical}>
                <View style={styles.photoOverlay} />
              </Photo>
              <Photo
                photoId='-KYXAN6XPt65eztQdV9C'
                style={styles.boxVertical}>
                <View style={styles.photoOverlay} />
              </Photo>
            </View>
            <View style={styles.boxHorizontal}>
              <Photo
                photoId='-KYB2Hrjbmtsss0YHJIF'
                style={styles.boxVertical}>
                <View style={styles.photoOverlay} />
              </Photo>
            </View>
          </View>
          <MapView
            ref='map'
            showsUserLocation
            showsMyLocationButton={false}
            rotateEnabled={false}
            pitchEnabled={false}
            zoomEnabled={false}
            scrollEnabled={false}
            region={this.state.location}
            provider={MapView.PROVIDER_GOOGLE}
            customMapStyle={Styles.MapStyle}
            style={styles.box} />
        </View>
        <View style={styles.boxOverlay}>
          <View style={styles.boxHorizontal}>
            <View style={[
              styles.boxVertical,
              {
                backgroundColor: Colors.Foreground
              }
            ]}>
              <Text style={styles.name}>
                {this.state.countAttempts || 0}
              </Text>
              <Text style={styles.statName}>
                JOINED
              </Text>
            </View>
            <View style={[
              styles.boxVertical,
              {
                backgroundColor: Colors.Primary
              }
            ]}>
              <Text style={styles.name}>
                {this.state.countWon || 0}
              </Text>
              <Text style={styles.statName}>
                WON
              </Text>
            </View>
          </View>
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
    marginLeft: Sizes.InnerFrame,
    alignItems: 'flex-start',
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

  region: {
    marginTop: Sizes.OuterFrame
  },

  stats: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: Colors.Tertiary
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

  blurb: {
    fontSize: Sizes.SmallText
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

  boxHorizontal: {
    width: Sizes.Width / 2,
    height: Sizes.Width / 4,
    flexDirection: 'row'
  },

  boxVertical: {
    width: Sizes.Width / 4,
    height: Sizes.Width / 4,
    borderRadius: 0,
    margin: 0,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  boxOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: Sizes.Width,
    alignItems: 'center',
    backgroundColor: Colors.Transparent,
    shadowColor: Colors.Black,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },

  photoOverlay: {
    flex: 1,
    height: Sizes.Width / 4,
    width: Sizes.Width / 4,
    backgroundColor: Colors.MediumWhiteOverlay
  },

  closeButton: {
    left: Sizes.OuterFrame * 2
  }
});
