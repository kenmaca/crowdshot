import React, {
  Component
} from 'react';
import {
  View, StyleSheet, ListView, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import RewardCard from './RewardCard';

export default class RewardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rewards: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(
        Object.keys(
          this.props.category.rewards || {}
        ) || []
      )
    };

    // methods
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(rewardId) {
    return (
      <RewardCard rewardId={rewardId} />
    );
  }

  render() {
    return (
      <ListView
        enableEmptySections
        scrollEnabled
        removeClippedSubviews={false}
        key={this.props.categoryId}
        style={styles.container}
        dataSource={this.state.rewards}
        renderRow={this.renderRow} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  }
});
