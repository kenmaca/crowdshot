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
import Database from '../../utils/Database';

// components
import ContestThumbnail from '../../components/lists/ContestThumbnail';
import SwipeCards from 'react-native-swipe-cards';
import ContestPhotoCard from '../../components/lists/ContestPhotoCard';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Button from '../../components/common/Button';

export default class ContestPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      thumbnails: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    // database
    this.ref = Database.ref(
      `entries/${this.props.contestId}`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {

        // entry keys
        let entries = Object.keys(data.val());
        this.setState({
          entries: entries,
          thumbnails: this.state.thumbnails.cloneWithRows(
            entries
          )
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
        <SwipeCards
          ref='swiper'
          containerStyle={styles.cards}
          cards={this.state.entries}
          renderCard={entry => (
            <ContestPhotoCard
              contestId={this.props.contestId}
              entryId={entry}
              i={this.state.entries.indexOf(entry) + 1}
              n={this.state.entries.length} />
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
            if (i >= this.state.entries.length - 1) {
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
                <ContestThumbnail
                  contestId={this.props.contestId}
                  entryId={data} />
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
    marginBottom: Sizes.InnerFrame * 1.25,
    backgroundColor: Colors.Transparent
  },

  thumbnailContainer: {
    padding: Sizes.InnerFrame,
    alignSelf: 'stretch',
    backgroundColor: Colors.Foreground
  },

  thumbnails: {
    alignItems: 'center'
  },

  endButton: {
    alignSelf: 'stretch',
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  }
});
