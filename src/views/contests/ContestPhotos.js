import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Alert, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import SwipeCards from 'react-native-swipe-cards';
import ContestPhotoCard from '../../components/lists/ContestPhotoCard';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';

export default class ContestPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {selected: false}, {selected: true}, {}, {}
      ]
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <SwipeCards
          containerStyle={styles.cards}
          cards={this.state.cards}
          renderCard={entry => (
            <ContestPhotoCard
              {...entry}
              i={this.state.cards.indexOf(entry) + 1}
              n={this.state.cards.length} />
          )}
          yupText='Shortlist!'
          noText='Nope!'
          handleYup={entry => {
            entry.selected = true;
          }}
          handleNope={entry => {
            entry.selected = false;
          }}
          cardRemoved={i => {

            // handle end of selection
            if (i >= this.state.cards.length - 1) {
              Alert.alert('end');
            }
          }} />
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    alignItems: 'center',
    justifyContent: 'center'
  },

  cards: {
    flex: 1,
    marginTop: Sizes.Height / 7,
    backgroundColor: Colors.Transparent
  },

  noMoreContainer: {
    flex: 1,
    marginTop: -Sizes.Height / 7,
    alignItems: 'center',
    justifyContent: 'center'
  },

  noMore: {
    fontSize: Sizes.H1 * 2
  }
});
