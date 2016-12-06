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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import CircleIcon from '../common/CircleIcon';

export default class TrophyCase extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onPress}>
        <Text style={[
          styles.trophyAmount,
          this.props.color && {
            color: this.props.color
          }
        ]}>
          {
            `$${this.props.bounty || 0}`
          }
        </Text>
        <View style={styles.trophyCase}>
          {
            Object.keys(
              this.props.prizes || {}
            ).map(prizeId => (
              <FontAwesomeIcon
                key={prizeId}
                name='trophy'
                color={Colors.Trophy}
                style={styles.trophy} />
            ))
          }
          {
            this.props.isOwn && (
              <CircleIcon
                icon='add'
                size={12}
                style={styles.trophy} />
            )
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginRight: Sizes.InnerFrame / 2,
    alignItems: 'flex-end',
    backgroundColor: Colors.Transparent
  },

  trophyCase: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  trophy: {
    marginLeft: Sizes.InnerFrame / 4
  },

  trophyAmount: {
    marginBottom: Sizes.InnerFrame / 4,
    fontSize: Sizes.H3,
    fontWeight: '500',
    color: Colors.Text
  }
});
