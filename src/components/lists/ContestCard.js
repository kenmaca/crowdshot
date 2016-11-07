import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ScrollView
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import Button from '../common/Button';
import InputSectionHeader from '../common/InputSectionHeader';
import Photo from '../common/Photo';
import PhotoGrid from '../common/PhotoGrid';
import Divider from '../common/Divider';
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
          <View style={styles.buttonContainer}>
            <Button
              size={Sizes.H2}
              style={styles.button}
              icon='card-giftcard'
              color={Colors.Transparent} />
            <Button
              onPress={() => Actions.contestPhotos({
                contestId: 'testContest'
              })}
              size={Sizes.H2}
              style={styles.button}
              icon='delete-forever'
              color={Colors.Transparent} />
          </View>
          <OutlineText
            text='$100 Bounty To Top 3' />
        </Photo>
        <View style={styles.body}>
          <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
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
          <ScrollView style={styles.detailContainer}>
            <View style={styles.summary}>
              <CircleIconInfo
                size={Sizes.H2}
                color={Colors.Primary}
                icon='burst-mode'
                label='4 entries submitted from 3 photographers' />
              <CircleIconInfo
                size={Sizes.H2}
                color={Colors.Primary}
                icon='directions-run'
                label='23 photograhers nearby' />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.instructionContainer}>
              <InputSectionHeader label='Instructions' />
              <Text style={styles.instructions}>
                Take a landscape photo to include the entire
                ridge and surrounding mountains. Bonus points to
                wide angle and use of DOF.
              </Text>
            </View>
            <View style={styles.photoContainer}>
              <InputSectionHeader label='Contest Entries' />
              <PhotoGrid
                style={styles.photoGrid}
                width={Sizes.Width - Sizes.InnerFrame * 2.5}
                eachRow={3}
                photoIds={[
                  'appLoginBackground',
                  'appLoginBackground',
                  'appLoginBackground',
                  'appLoginBackground'
                ]} />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Sizes.Width - Sizes.InnerFrame / 2,
    borderRadius: 5,
    overflow: 'hidden'
  },

  header: {
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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

  detailContainer: {
    flex: 1,
    paddingBottom: Sizes.OuterFrame * 10
  },

  summary: {
    padding: Sizes.InnerFrame
  },

  instructionContainer: {
    marginTop: Sizes.InnerFrame,
  },

  instructions: {
    marginLeft: Sizes.InnerFrame,
    color: Colors.AlternateText,
    fontWeight: '100'
  },

  photoContainer: {
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame * 3,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  photoGrid: {
    marginLeft: Sizes.InnerFrame
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },

  button: {
    paddingTop: Sizes.InnerFrame / 2,
    paddingBottom: Sizes.InnerFrame / 2,
    paddingLeft: Sizes.InnerFrame / 2,
    paddingRight: Sizes.InnerFrame / 2
  }
});
