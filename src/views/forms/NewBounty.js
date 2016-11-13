import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import PriceSelect from '../../components/common/PriceSelect';
import CardSelect from '../../components/common/CardSelect';
import Button from '../../components/common/Button';

export default class NewBounty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stripeCardId: null,
      bounty: null
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Set the Bounty Amount
          </Text>
        </View>
        <View style={styles.content}>
          <CardSelect
            onSelected={stripeCardId => this.setState({
              stripeCardId: stripeCardId
            })}
            label='Payment Method' />
          <PriceSelect
            isBottom
            noMargin
            label='Bounty'
            onSelected={bounty => this.setState({
              bounty: bounty
            })}
            subtitle='Awarded to the winner' />
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimer}>
              This will be charged immediately to your
              chosen payment method at the start of your contest.
              This amount can be refunded if the contest is cancelled
              due a lack of photos submitted by contestants.
            </Text>
          </View>
          <Button
            isDisabled={this.state.bounty && !this.state.stripeCardId}
            color={Colors.Primary}
            label='Add bounty to contest' />
        </View>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  titleContainer:{
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Sizes.InnerFrame,
    height: Sizes.NavHeight,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H3
  },

  content: {
    alignItems: 'center'
  },

  disclaimerContainer: {
    padding: Sizes.InnerFrame,
    paddingLeft: Sizes.OuterFrame,
    paddingRight: Sizes.OuterFrame
  },

  disclaimer: {
    textAlign: 'center',
    fontSize: Sizes.SmallText,
    color: Colors.SubduedText
  }
});
