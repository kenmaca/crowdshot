import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Alert, Text, ListView, TouchableOpacity,
  Animated
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import SwipeCards from 'react-native-swipe-cards';
import ContestPhotoCard from '../../components/lists/ContestPhotoCard';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Button from '../../components/common/Button';

export default class ContestPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: 1234,
      prizes: {
        '1234': true,
        '1235': true
      },
      referencePhotoId: 'appLoginBackground',
      instructions: 'stuff',
      locationId: 'location',
      entries: {
        abc1: true,
        abc2: true,
        abc3: true
      },
      thumbnails: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };
  }

  componentWillMount() {
    this.setState({
      thumbnails: this.state.thumbnails.cloneWithRows(
        Object.keys(this.state.entries)
      )
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SwipeCards
          ref='swiper'
          containerStyle={styles.cards}
          cards={Object.keys(this.state.entries)}
          renderCard={entry => (
            <ContestPhotoCard
              i={
                Object.keys(
                  this.state.entries
                ).indexOf(entry) + 1
              }
              n={
                Object.keys(this.state.entries).length
              } />
          )}
          yupText='Shortlist!'
          noText='Nope!'
          loop
          handleYup={entry => {
            entry
          }}
          handleNope={entry => {
            entry
          }}
          cardRemoved={i => {

            // handle end of selection
            if (i >= Object.keys(this.state.entries).length - 1) {
            }
          }} />
        <CloseFullscreenButton />
        <ListView
          horizontal
          pagingEnabled
          dataSource={this.state.thumbnails}
          style={styles.thumbnailContainer}
          contentContainerStyle={styles.thumbnails}
          renderRow={data => {
            return (
              <TouchableOpacity
                onPress={() => {

                  // shortcut to card directly
                  Animated.decay(
                    this.refs.swiper.state.pan,
                    {
                      velocity: {x: 0, y: 12},
                      deceleration: 0.98
                    }
                  ).start(
                    () => {
                      this.refs.swiper._resetState.bind(
                        this.refs.swiper
                      )();
                      this.refs.swiper.setState({
                        card: data
                      });
                    }
                  );
                }}>
                <View style={{
                  backgroundColor: Colors.Primary,
                  width: 50, height: 50, margin: 1
                }} />
              </TouchableOpacity>
            );
          }} />
        <Button
          squareBorders
          fontAwesome
          icon='trophy'
          style={styles.endButton}
          color={Colors.Primary}
          label='End Contest & Announce Winners' />
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
    marginTop: Sizes.Height / 7,
    marginBottom: Sizes.OuterFrame * 1.25,
    backgroundColor: Colors.Transparent
  },

  thumbnailContainer: {
    padding: Sizes.InnerFrame,
    alignSelf: 'stretch',
    backgroundColor: Colors.Foreground
  },

  thumbnails: {
    alignItems: 'flex-end'
  },

  endButton: {
    alignSelf: 'stretch',
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  }
});
