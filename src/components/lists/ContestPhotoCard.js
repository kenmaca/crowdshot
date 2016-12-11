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
import Database from '../../utils/Database';

// components
import Photo from '../common/Photo';
import Button from '../common/Button';
import UserSummary from '../profiles/UserSummary';
import OutlineText from '../common/OutlineText';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class ContestPhotoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Database.ref(
      `entries/${
        this.props.contestId
      }/${
        this.props.entryId
      }`
    ).once('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });
      }
    });
  }

  render() {
    return (
      <Photo
        photoId={this.state.photoId}
        style={styles.container}>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            onPress={() => {

              // launch report screen
              Actions.report({
                contestId: this.props.contestId,
                entryId: this.props.entryId,
                photoId: this.state.photoId
              });

              // shutdown the modal
              this.props.parent && this.props.parent.setState({
                visible: false
              });
            }}
            style={styles.reportContainer}>
            <Icon
              name='report-problem'
              size={14}
              color={Colors.Text} />
            <Text style={styles.report}>
              Report
            </Text>
          </TouchableOpacity>
          <OutlineText
            text={`${
              this.props.i || 1
            } of ${
              this.props.n || 1
            }`} />
        </View>
        <UserSummary
          uid={this.state.createdBy} />
      </Photo>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Sizes.InnerFrame,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: Sizes.Width / 1.15,
    height: Sizes.Width * 1.15,
    borderRadius: 15,
    overflow: 'hidden'
  },

  statusContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },

  reportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.Transparent
  },

  report: {
    marginLeft: Sizes.InnerFrame / 3,
    fontSize: Sizes.SmallText,
    color: Colors.Text,
    backgroundColor: Colors.Transparent
  }
});
