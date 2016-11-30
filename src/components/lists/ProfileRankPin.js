import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Database from '../../utils/Database';
import {
  getRankString, emojis
} from '../profiles/Rank';

export default class ProfileRankPin extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `profiles/${
        this.props.profileId
      }/countWon`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          contestsWon: data.val() || 0
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  render() {
    let rank = emojis(
      getRankString(this.state.contestsWon || 0)
    );

    return (
      <View style={[
        styles.container,
        {
          width: this.props.outerSize,
          height: this.props.outerSize,
          borderRadius: this.props.outerSize / 2,
        }
      ]}>
        <View style={[
          styles.profile,
          {
            width: this.props.innerSize,
            height: this.props.innerSize,
            borderRadius: this.props.innerSize / 2,
          }
        ]}>
          <Text style={[
            styles.rank,
            this.props.innerSize && {
              fontSize: this.props.innerSize,
              lineHeight: this.props.innerSize
            }
          ]}>
            {rank[rank.length - 1]}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WhiteOverlay,
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: Sizes.InnerFrame / 2,
      width: 0
    }
  },

  profile: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.AlternateText,
    overflow: 'hidden'
  },

  rank: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    backgroundColor: Colors.Transparent
  }
});
