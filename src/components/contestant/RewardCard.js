import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import Photo from '../common/Photo';
import CircleIcon from '../common/CircleIcon';

export default class RewardCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `rewards/${
        this.props.rewardId
      }`
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
      <TouchableOpacity
        onPress={() => this.props.add(
          this.props.rewardId,
          this.state
        )}
        style={styles.container}>
        <Photo
          photoId={this.state.photo}
          style={styles.cover} />
        <View style={styles.content}>
          <Photo
            photoId={this.state.thumbnail}
            style={styles.thumbnail} />
          <View style={styles.details}>
            <Text style={styles.title}>
              {this.state.name}
            </Text>
            <Text style={styles.description}>
              {this.state.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ModalForeground,
    margin: Sizes.InnerFrame,
    marginBottom: 0
  },

  cover: {
    height: Sizes.InnerFrame * 10,
    alignSelf: 'stretch'
  },

  content: {
    flexDirection: 'row',
    padding: Sizes.InnerFrame
  },

  thumbnail: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.Transparent
  },

  details: {
    marginLeft: Sizes.InnerFrame
  },

  title: {
    fontSize: Sizes.H4,
    fontWeight: '500',
    color: Colors.AlternateText
  },

  description: {
    marginTop: Sizes.InnerFrame / 6,
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.SubduedText
  }
});
