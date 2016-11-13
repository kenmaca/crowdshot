import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Photo from '../common/Photo';
import CircleIcon from '../common/CircleIcon';

export default class ChecklistItem extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.container}>
        <View style={styles.circularPhotoContainer}>
          <Photo
            photoId={this.props.photoId}
            style={styles.circularPhoto} />
        </View>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {this.props.title}
            </Text>
            {
              this.props.checked
              ? (
                <CircleIcon size={18} />
              ): (
                <CircleIcon
                  size={18}
                  color={Colors.ModalBackground}
                  checkColor={Colors.AlternateText}
                  icon='arrow-forward' />
              )
            }
          </View>
          <Text style={styles.subtitle}>
            {this.props.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Sizes.InnerFrame,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },

  circularPhotoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden'
  },

  circularPhoto: {
    width: 80,
    height: 80,
    backgroundColor: Colors.ModalBackground
  },

  content: {
    flex: 1,
    paddingLeft: Sizes.InnerFrame
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  title: {
    fontSize: Sizes.H3,
    color: Colors.Text,
    fontWeight: '500'
  },

  subtitle: {
    marginTop: Sizes.InnerFrame / 2,
    fontSize: Sizes.Text,
    color: Colors.SubduedText,
    fontWeight: '100'
  }
});
