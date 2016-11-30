import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import {
  Actions
} from 'react-native-router-flux';
import Database from '../../utils/Database';

// components
import Avatar from './Avatar';
import CircleIcon from '../common/CircleIcon';

export default class ProfileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `profiles/${Firebase.auth().currentUser.uid}`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  render() {
    return (
      <View style={[
        styles.container,
        this.props.color && {
          backgroundColor: this.props.color
        }
      ]}>
        <Avatar
          outline
          showRank
          outlineColor={Colors.Overlay}
          uid={Firebase.auth().currentUser.uid}
          size={92}
          onPress={() => Actions.newReferencePhoto({
            onTaken: photoId => {
              Database.ref(
                `profiles/${
                  Firebase.auth().currentUser.uid
                }/photo`
              ).set(photoId);
            },
            title: 'Take a new display picture'
          })} />
        <TouchableOpacity
          onPress={Actions.profileEdit}
          style={styles.profile}>
          <View style={styles.displayNameContainer}>
            <Text style={[
              styles.text,
              styles.displayName
            ]}>
              {this.state.displayName || 'Unknown'}
            </Text>
            <CircleIcon
              icon='arrow-forward'
              color={Colors.Text}
              checkColor={Colors.AlternateText}
              size={12} />
          </View>
          <Text style={[
            styles.text,
            styles.region
          ]}>
            {this.state.currentRegion || 'Unknown'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    padding: Sizes.OuterFrame,
    paddingTop: Sizes.InnerFrame,
    backgroundColor: Colors.Foreground
  },

  profile: {
    marginTop: Sizes.InnerFrame,
    marginLeft: Sizes.InnerFrame
  },

  text: {
    color: Colors.Text,
    fontWeight: '100'
  },

  displayNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  displayName: {
    marginRight: Sizes.InnerFrame / 2,
    fontSize: Sizes.H3,
    fontWeight: '500'
  },

  region: {
    marginTop: Sizes.InnerFrame / 4,
    fontSize: Sizes.SmallText
  }
});
