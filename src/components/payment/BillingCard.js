import React, {
  Component
} from 'react';
import {
  View, StyleSheet, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import CircleIcon from '../common/CircleIcon';
import Divider from '../common/Divider';
import InformationField from '../common/InformationField';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BillingCard extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.container}>
        <View style={styles.content}>
          <Icon
            style={styles.cardType}
            name={(() => {
              switch(this.props.type) {
                case 1: return 'cc-mastercard';
                case 2: return 'cc-amex';
                default: return 'cc-visa';
              }
            })()}
            size={12}
            color={Colors.Primary} />
          <View style={styles.details}>
            <InformationField
              color={Colors.Transparent}
              info={this.props.name || 'Unknown'}
              label='Card Holder' />
            <InformationField
              color={Colors.Transparent}
              info={`**** **** **** ${this.props.lastFour || '****'}`}
              label='Number' />
            <InformationField
              isBottom
              noLine
              noMargin
              color={Colors.Transparent}
              info={`${this.props.expiryMonth}/${this.props.expiryYear}`}
              label='Expiry' />
          </View>
        </View>
        <Divider />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: Colors.Background
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame,
  },

  cardType: {
    margin: Sizes.InnerFrame
  },

  details: {
    flex: 1
  }
});
