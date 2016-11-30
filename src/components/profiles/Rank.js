import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

const ranks = {
  1023: '🍆',
  511: '🍑',
  255: '💯',
  127: '🔥',
  63: '🌶',
  31: '🙏',
  15: '🙌',
  7: '👌',
  3: '🌿',
  1: '🌱'
};

export function getRankString(contestsWon) {
  let rank = '';
  for (tier of Object.keys(ranks).reverse()) {
    rank = Array(
      Math.floor(contestsWon / tier) + 1
    ).join(ranks[tier]) + rank;
    contestsWon = contestsWon % tier;
  }

  return rank;
}

export function emojis(str) {
  split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
  arr = [];
  for (var i=0; i<split.length; i++) {
    char = split[i]
    if (char !== '') {
      arr.push(char);
    }
  }

  return arr;
};

export default class Rank extends Component {
  render() {
    let rank = emojis(
      getRankString(this.props.contestsWon || 0)
    );

    return (
      rank ? (
        <Text style={[
          styles.container,
          this.props.size && {
            fontSize: this.props.size,
            lineHeight: this.props.size * 1.5
          },
          this.props.style
        ]}>
          {
            this.props.onlyLast
            ? rank[rank.length - 1]: rank
          }
        </Text>
      ): (
        <View />
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    fontSize: Sizes.Text
  }
});
