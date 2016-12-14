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
      <View style={styles.container}>
        <Text>
          {this.props.rewardId}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Sizes.InnerFrame,
    backgroundColor: Colors.ModalForeground,
    marginBottom: 2
  }
});
