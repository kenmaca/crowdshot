import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Modal, Image, Text,
  TouchableWithoutFeedback, TouchableOpacity, Alert
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';

// components
import Button from '../common/Button';
import Photo from '../common/Photo';
import CircleIcon from '../common/CircleIcon';

export default class ContestFinalize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: {},
      finalizedVisible: false,
      upsellVisible: false
    };

    this.finalize = this.finalize.bind(this);
    this.ref = Database.ref(
      `entries/${this.props.contestId}`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          entries: data.val()
        });
      }
    })
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  finalize() {

    // determine if contest criteria have been met
    let winners = Object.values(this.state.entries).filter(
      entry => entry.selected
    );
    let prizes = Object.keys(this.props.prizes || {});

    if (winners.length > prizes.length) {
      this.setState({
        upsellVisible: true
      });
    } else if (

      // allow bypass if there's more prizes than
      // entries
      (winners.length == prizes.length)
      || (
        prizes.length > Object.keys(
          this.state.entries
        ).length
      ) && (
        winners.length == Object.keys(
          this.state.entries
        ).length
      )
    ) {

      // ready to finalize the contest
      Database.ref(
        `contests/${
          this.props.contestId
        }`
      ).update({
        isComplete: true
      });

      // trigger server processing backlog
      Database.ref(
        `contestTasks/${
          this.props.contestId
        }`
      ).set(true);

      // update user's list of contests
      Database.ref(
        `profiles/${
          Firebase.auth().currentUser.uid
        }/contests/${
          this.props.contestId
        }`
      ).remove();

      // add to completed list
      Database.ref(
        `profiles/${
          Firebase.auth().currentUser.uid
        }/completedContests/${
          this.props.contestId
        }`
      ).set(true);

      // show view
      this.setState({
        finalizedVisible: true
      });
    } else {
      Alert.alert(
        'Please Vote',
        'There\'s still some prizes left. '
        + 'Select some more winners before ending this contest.'
      );
    }
  }

  render() {

    // TODO: add fancy fireworks animations here
    return (
      <View>
        <Modal
          transparent
          visible={this.state.upsellVisible}
          animationType='slide'>
          <TouchableWithoutFeedback
            onPress={() => this.setState({
              upsellVisible: false
            })}>
            <View style={styles.upsellContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.upsellModal}>
                  <Photo
                    uri='https://s-media-cache-ak0.pinimg.com/originals/92/84/f1/9284f109c798b0c0df93e9f9a7f923ac.jpg'
                    style={styles.upsellPhoto} />
                  <View style={styles.upsellContentContainer}>
                    <View style={styles.upsellTextContainer}>
                      <Text style={[
                        styles.upsellText,
                        styles.upsellTitle
                      ]}>
                        Not enough prizes to go around
                      </Text>
                      <Text style={[
                        styles.upsellText,
                        styles.upsellDescription
                      ]}>
                        Add more prizes so sad kitty isn't sad anymore or
                        select less winning photos.
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {

                        // close upsell
                        this.setState({
                          upsellVisible: false
                        });

                        // now ask for money
                        Actions.newBounty({
                          onCharged: prizeId => Database.ref(
                            `contests/${
                              this.props.contestId
                            }/prizes/${
                              prizeId
                            }`
                          ).set(true)
                        });
                      }}>
                      <CircleIcon
                        icon='add'
                        size={Sizes.InnerFrame * 3} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          visible={this.state.finalizedVisible}
          animationType='slide'>
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={[
                styles.text,
                styles.title
              ]}>
                Yussss!
              </Text>
              <Text style={[
                styles.text,
                styles.description
              ]}>
                You've picked the best and your contest is now complete.
                We hope you love the photos as much as we do!
              </Text>
              <Button
                onPress={() => {

                  // remove overlay
                  this.setState({
                    finalizedVisible: false
                  });

                  // and show completed contest view
                  // TODO: a dedicated completed view of contest
                  Actions.contest({
                    contestId: this.props.contestId
                  });
                }}
                label='View the winning photos'
                color={Colors.Background} />
            </View>
            <Image
              source={require('../../../res/img/finalized.png')}
              style={styles.finalizedPhoto} />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.Primary
  },

  finalizedPhoto: {
    width: 350,
    height: 350
  },

  textContainer: {
    padding: Sizes.OuterFrame,
    alignItems: 'center'
  },

  text: {
    color: Colors.AlternateText
  },

  title: {
    marginTop: Sizes.InnerFrame * 3,
    fontSize: Sizes.H1,
    fontWeight: '600'
  },

  description: {
    padding: Sizes.InnerFrame,
    textAlign: 'center',
    fontSize: Sizes.H4
  },

  upsellContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DarkOverlay
  },

  upsellModal: {
    justifyContent: 'flex-end',
    width: Sizes.Width * 0.9
  },

  upsellPhoto: {
    alignSelf: 'stretch',
    height: Sizes.Width * 0.6
  },

  upsellContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: Sizes.InnerFrame,
    backgroundColor: Colors.Foreground
  },

  upsellTextContainer: {
    flex: 1
  },

  upsellText: {
    padding: 5,
    color: Colors.Text
  },

  upsellTitle: {
    fontSize: Sizes.H3,
    fontWeight: '500'
  },

  upsellDescription: {
    fontSize: Sizes.Text
  }
});
