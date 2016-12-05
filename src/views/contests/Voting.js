import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, TouchableOpacity,
  Modal
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
import SwipeCards from 'react-native-swipe-cards';
import ContestPhotoCard from '../../components/lists/ContestPhotoCard';
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import ContestThumbnail from '../../components/lists/ContestThumbnail';

export default class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      cards: [],
      entries: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `entries/${
        this.props.contestId
      }`
    );

    // methods
    this.renderCard = this.renderCard.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        let entries = Object.keys(data.val());
        this.setState({
          entries: this.state.entries.cloneWithRows(
            entries
          ),
          cards: entries
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  renderRow(entryId) {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(this.refs);
          console.log(this.refs.swiper);
          // this.refs.cards.setState({
          //   card: entryId
          // });

          this.setState({
            visible: true
          });
        }}>
        <ContestThumbnail
          size={
            (
              Sizes.Width
              - (Sizes.OuterFrame * 2)
            ) / 3 - 2
          }
          contestId={this.props.contestId}
          entryId={entryId} />
      </TouchableOpacity>
    );
  }

  renderCard(entryId) {
    return (
      <ContestPhotoCard
        key={entryId}
        contestId={this.props.contestId}
        entryId={entryId}
        i={this.state.cards.indexOf(entryId) + 1}
        n={this.state.cards.length} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent
          ref='swiper'
          visible={this.state.visible}
          onRequestClose={() => true}
          animationType='fade'>
          <View style={styles.voteContainer}>
            <SwipeCards
              loop
              ref='cards'
              containerStyle={styles.vote}
              cards={this.state.cards}
              renderCard={this.renderCard}
              cardRemoved={i => {
                if (i >= this.state.cards.length - 1) {
                  this.setState({
                    visible: false
                  });
                }
              }} />
          </View>
        </Modal>
        <TitleBar title='Contest Voting' />
        <View style={styles.entryContainer}>
          <ListView
            key={Math.random()}
            horizontal
            scrollEnabled={false}
            renderRow={this.renderRow}
            dataSource={this.state.entries}
            contentContainerStyle={styles.entries} />
        </View>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  entryContainer: {
    flex: 1,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    padding: Sizes.OuterFrame
  },

  entries: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },

  voteContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DarkOverlay
  },

  vote: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Transparent
  }
});
