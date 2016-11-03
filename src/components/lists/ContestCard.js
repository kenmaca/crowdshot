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
import OutlineText from '../common/OutlineText';

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
    height: 75,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame
  },

  body: {
    flex: 1,
    backgroundColor: Colors.ModalBackground,
    padding: Sizes.InnerFrame
  }
});
