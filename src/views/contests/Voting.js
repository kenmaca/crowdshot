import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, TouchableOpacity,
  Modal, TouchableWithoutFeedback, Alert
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
import Button from '../../components/common/Button';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ContestFinalize from '../../components/lists/ContestFinalize';

export default class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      cards: [],
      blob: {},
      entries: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      contest: {}
    };

    this.ref = Database.ref(
      `entries/${
        this.props.contestId
      }`
    );

    this.contestRef = Database.ref(
      `contests/${
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
        let blob = data.val();
        let entries = Object.keys(blob);
        this.setState({
          entries: this.state.entries.cloneWithRows(
            entries
          ),
          cards: entries,
          blob: blob
        });
      }
    });

    this.contestListener = this.contestRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          contest: data.val()
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
          this.setState({
            visible: true
          }, () => this.refs.swiper.setState({
            card: entryId
          }));
        }}>
        <ContestThumbnail
          size={
            (
              Sizes.Width
              - (Sizes.OuterFrame * 2)
            ) / 3 - 2
          }
          rejectedOverlay={Colors.WhiteOverlay}
          contestId={this.props.contestId}
          entryId={entryId} />
      </TouchableOpacity>
    );
  }

  renderCard(entryId) {
    return (
      <TouchableOpacity
        activeOpacity={1}>
        <ContestPhotoCard
          key={entryId}
          contestId={this.props.contestId}
          entryId={entryId}
          i={this.state.cards.indexOf(entryId) + 1}
          n={this.state.cards.length} />
      </TouchableOpacity>
    );
  }

  render() {
    let countPrizes = (
      this.state.contest.prizes
      && Object.keys(
        this.state.contest.prizes
      ).length
    ) || 0;
    let entries = Object.values(
      this.state.blob
    );
    let countEntries = entries.length || 0;
    let countSelected = entries.filter(
      entry => entry.selected
    ).length || 0;

    return (
      <View style={styles.container}>
        <Modal
          transparent
          visible={this.state.visible}
          onRequestClose={() => true}
          animationType='fade'>
          <SwipeCards
            ref='swiper'
            containerStyle={styles.vote}
            cards={this.state.cards}
            renderCard={this.renderCard}
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
              if (i >= this.state.cards.length - 1) {
                this.setState({
                  visible: false
                });
              }
            }} />
          <CloseFullscreenButton
            action={() => this.setState({
              visible: false
            })} />
        </Modal>
        <TitleBar
          title='Contest Voting'>
          <Button
            label='Finalize Contest'
            color={Colors.Primary}
            onPress={() => this.refs.finalize.finalize()}
            isDisabled={

              // disallow premature end
              Date.now() < this.state.contest.endDate

              // disallow insufficient prizes
              || countSelected > countPrizes

              // disallow under selection if more
              // prizes than entries (must select all)
              || (
                countEntries < countPrizes
                && countEntries > countSelected

              // disallow under selection if selected
              // less than number of available prizes
              ) || (
                countEntries >= countPrizes
                && countSelected < countPrizes
              )
            }
            onPressDisabled={
              () => {
                if (Date.now() < this.state.contest.endDate) {
                  Alert.alert('Contest has not ended yet.');
                } else if (countSelected > countPrizes) {
                  Alert.alert(
                    'Too many entries selected',
                    'Please add more bounties or unselect some entries.'
                  );
                } else if (
                  (
                    countEntries < countPrizes
                    && countEntries > countSelected
                  ) || (
                    countEntries >= countPrizes
                    && countSelected < countPrizes
                  )
                ) {
                  Alert.alert(
                    'Select more entries',
                    'You still have some available prizes to award.'
                  );
                }
              }
            } />
        </TitleBar>
        <View style={styles.trophies}>
          {
            new Array(
              Math.max(countPrizes, countSelected)
            ).fill(true).map((trophy, i) => (
              <FontAwesomeIcon
                key={Math.random()}
                name='trophy'
                color={
                  i < countSelected
                  ? i < countPrizes
                    ? Colors.Primary
                    : Colors.Overlay
                  : Colors.Trophy
                }
                size={Sizes.H3}
                style={styles.trophy} />
            ))
          }
        </View>
        <View style={styles.entryContainer}>
          <ListView
            key={Math.random()}
            horizontal
            scrollEnabled={false}
            renderRow={this.renderRow}
            dataSource={this.state.entries}
            contentContainerStyle={styles.entries} />
        </View>
        <ContestFinalize
          ref='finalize'
          {...this.state.contest}
          contestId={this.props.contestId} />
        <CloseFullscreenButton back />
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

  vote: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DarkOverlay
  },

  trophies: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: Sizes.InnerFrame,
    paddingTop: 0,
    paddingLeft: Sizes.OuterFrame,
    paddingRight: Sizes.OuterFrame,
    backgroundColor: Colors.Foreground
  },

  trophy: {
    marginRight: Sizes.InnerFrame / 2
  }
});
