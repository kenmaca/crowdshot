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
import ContestFinalize from '../../components/lists/ContestFinalize';

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
    this.contestRef = Database.ref(
      `contests/${this.props.contestId}`
    );

    // binding
    this.switch = this.switch.bind(this);
  }

  switch(card) {

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
          card: card
        });
      }
    );
  }

  componentDidMount() {
    this.ref.once('value', data => {
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

    this.contestRef.once('value', data => {
      if (data.exists()) {
        this.setState({
          contest: data.val()
        });
      }
    });

    // allow initial switching if requested through
    // props
    if (this.props.startCard) {
      this.switch(this.props.startCard);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <SwipeCards
          loop
          ref='swiper'
          containerStyle={styles.cards}
          cards={this.state.entries}
          renderCard={entry => (
            <ContestPhotoCard
              key={entry}
              contestId={this.props.contestId}
              entryId={entry}
              i={this.state.entries.indexOf(entry) + 1}
              n={this.state.entries.length} />
          )}
          yupText='Shortlist!'
          noText='Nope!'
          handleYup={entry => {
            Database.ref(
              `entries/${
                this.props.contestId
              }/${
                entry
              }`
            ).update({
              selected: true
            });
          }}
          handleNope={entry => {
            Database.ref(
              `entries/${
                this.props.contestId
              }/${
                entry
              }`
            ).update({
              selected: false
            });
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
                onPress={() => this.switch(data)}>
                <ContestThumbnail
                  contestId={this.props.contestId}
                  entryId={data} />
              </TouchableOpacity>
            );
          }} />
        <ContestFinalize
          ref='finalize'
          {...this.state.contest}
          contestId={this.props.contestId} />
        <Button
          squareBorders
          fontAwesome
          onPress={() => this.refs.finalize.finalize()}
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
    marginTop: Sizes.Height / 10,
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
