import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Alert
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
      cards: [1, 2, 3, 4]
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <SwipeCards
          containerStyle={styles.cards}
          cards={this.state.cards}
          renderCard={data => <ContestPhotoCard />}
          renderNoMoreCards={() => <View />}
          yupText='Shortlist!'
          noText='Nope!'
          handleYup={() => Alert.alert('yep')}
          handleNope={() => Alert.alert('nope')} />
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
  }
});
