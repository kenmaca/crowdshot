import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Photo from '../common/Photo';
import PhotoGrid from '../common/PhotoGrid';
import OutlineText from '../common/OutlineText';
import CircleIconInfo from '../common/CircleIconInfo';
import * as Progress from 'react-native-progress';

export default class ContestCard extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Photo
          photoId='appLoginBackground'
          style={styles.header}>
          <OutlineText
            text='Toronto, ON, Canada' />
        </Photo>
        <View style={styles.body}>
          <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
              <View style={styles.progressTextSpacer} />
              <Text style={styles.progressTextUntil}>
                CONTEST ENDS AT
              </Text>
              <Text style={styles.progressTextEnd}>
                7:30PM
              </Text>
            </View>
            <Progress.Bar
              animated
              progress={0.3}
              width={Sizes.Width - Sizes.InnerFrame * 4}
              color={Colors.Primary}
              unfilledColor={Colors.LightOverlay}
              borderWidth={0} />
          </View>
          <View style={styles.summary}>
            <CircleIconInfo
              color={Colors.Primary}
              icon='burst-mode'
              label='4 entries submitted from 3 photographers' />
            <CircleIconInfo
              color={Colors.Primary}
              icon='directions-run'
              label='23 photograhers nearby' />
          </View>
          <View style={styles.photoContainer}>
            <PhotoGrid
              width={Sizes.Width - Sizes.InnerFrame * 2}
              eachRow={10}
              photoIds={[
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground',
                'appLoginBackground'
              ]} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Sizes.Width - Sizes.InnerFrame / 2,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: Sizes.InnerFrame / 4,
    marginLeft: Sizes.InnerFrame / 4,
    marginRight: Sizes.InnerFrame / 4,
  },

  header: {
    height: 125,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame
  },

  body: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.OuterFrame,
    backgroundColor: Colors.DarkOverlay
  },

  progressTextContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: Sizes.InnerFrame / 2,
    paddingTop: 0,
    flexDirection: 'row'
  },

  progressTextSpacer: {
    width: Sizes.InnerFrame * 3.5
  },

  progressTextUntil: {
    color: Colors.SubduedText,
    fontSize: Sizes.SmallText,
    fontWeight: '700'
  },

  progressTextEnd: {
    color: Colors.SubduedText,
    fontWeight: '700'
  },

  summary: {
    padding: Sizes.InnerFrame
  },

  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
