import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import CircleIcon from '../common/CircleIcon';
import Button from '../common/Button';
import Photo from '../common/Photo';

export default class EmptyContestCard extends Component {
  render() {
    return (
      <Photo
        photoId='appLoginBackground'
        style={styles.container}>
        <View style={styles.overlay}>
          <CircleIcon
            icon='insert-emoticon'
            size={48} />
          <Text style={[
            styles.text,
            styles.title
          ]}>
            Get amazing photos
          </Text>
          <Text style={[
            styles.text,
            styles.description
          ]}>
            Crowdshot taps into the millions of cameras constantly
            roaming across the planet. Let other people
            get that perfect shot.
          </Text>
          <Text style={[
            styles.text,
            styles.description
          ]}>
            You only pay for the best.
          </Text>
          <Button
            style={styles.button}
            onPress={Actions.mainBroadcast}
            color={Colors.ModalBackground}
            fontColor={Colors.AlternateText}
            rightIcon='arrow-forward'
            label='Get started now' />
        </View>
      </Photo>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Sizes.Width - Sizes.InnerFrame / 2,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.Background
  },

  overlay: {
    flex: 1,
    backgroundColor: Colors.MediumDarkOverlay,
    padding: Sizes.InnerFrame * 3,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },

  text: {
    color: Colors.Text,
    fontWeight: '200',
    marginTop: Sizes.InnerFrame,
    backgroundColor: Colors.Transparent
  },

  title: {
    fontSize: Sizes.H1
  },

  description: {
    fontSize: Sizes.H2
  },

  button: {
    marginTop: Sizes.OuterFrame
  }
});
