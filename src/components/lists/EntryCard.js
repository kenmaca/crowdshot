import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import Photo from '../common/Photo';
import CircleIcon from '../common/CircleIcon';

export default class EntryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contest: {}
    };

    this.ref = Database.ref(
      `entries/${
        this.props.contestId
      }/${
        this.props.entryId
      }`
    );

    this.contestRef = Database.ref(
      `contests/${
        this.props.contestId
      }`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
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
    this.contestListener && this.contestRef.off('value', this.contestListener);
  }

  render() {
    return (
      <View style={[
        styles.outline,
        this.state.selected && this.state.contest.isComplete && {
          borderLeftColor: Colors.Primary
        }
      ]}>
        <TouchableOpacity onPress={() => Actions.contestStatus({
          contestId: this.props.contestId
        })}>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => Actions.purchasedPhoto({
                photoId: this.state.photoId
              })}>
              <Photo
                photoId={this.state.photoId}
                style={styles.photo} />
            </TouchableOpacity>
            <View style={styles.content}>
              <Text style={[
                styles.status,
              ]}>
                {
                  (
                    state => {
                      let timeLeft = state.contest.endDate - Date.now();
                      if (state.contest.isCancelled) {
                        return 'Contest cancelled';
                      } else if (state.contest.isComplete) {
                        return 'Contest completed';
                      } else if (timeLeft > 0) {
                        return `Ending in ${
                          getTimeLeft(Date.now(), state.contest.endDate)
                        }`;
                      } else if (timeLeft <= 0) {
                        return 'Contest ended';
                      }
                    }
                  )(this.state)
                }
              </Text>
              <Text style={styles.details}>
                {
                  (
                    state => {
                      if (state.selected && state.contest.isComplete) {
                        return 'Winner — Bounty awarded!';
                      } else if (state.selected) {
                        return 'Shortlisted — waiting for contest to end';
                      } else if (state.selected === false || state.contest.isComplete) {
                        return 'Rejected';
                      } else {
                        return 'Awaiting results..';
                      }
                    }
                  )(this.state)
                }
              </Text>
            </View>
            <View style={styles.prizeContainer}>
              <Text style={[
                styles.prize,
                this.state.selected && this.state.contest.isComplete && {
                  color: Colors.Primary
                }
              ]}>
                {
                  `$${
                    this.state.contest.bounty || '0'
                  }`
                }
              </Text>
              <CircleIcon
                fontAwesome={this.state.selected && this.state.contest.isComplete}
                icon={
                  this.state.selected && this.state.contest.isComplete && 'trophy'
                  || this.state.selected && 'thumb-up'
                  || this.state.selected === false && 'thumb-down'
                  || 'thumbs-up-down'
                }
                color={
                  this.state.selected && Colors.Primary
                  || this.state.selected === false && Colors.Cancel
                  || Colors.Foreground
                }
                style={styles.statusIcon} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outline: {
    alignSelf: 'stretch',
    borderLeftWidth: Sizes.InnerFrame / 4,
    borderLeftColor: Colors.ModalForeground,
    backgroundColor: Colors.ModalForeground
  },

  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame,
    paddingLeft: Sizes.InnerFrame,
    backgroundColor: Colors.ModalForeground
  },

  photo: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: Colors.Transparent
  },

  content: {
    flex: 1,
    marginLeft: Sizes.InnerFrame / 2
  },

  status: {
    color: Colors.AlternateText,
    fontWeight: '500'
  },

  details: {
    marginTop: Sizes.InnerFrame / 4,
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.AlternateText
  },

  prizeContainer: {
    alignItems: 'flex-end'
  },

  prize: {
    fontSize: Sizes.H3,
    fontWeight: '500',
    color: Colors.AlternateText
  },

  statusIcon: {
    marginTop: Sizes.InnerFrame / 2
  }
});


function getTimeLeft(start, end){
  let t = end - start;
  let seconds = Math.floor((t / 1000) % 60);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  let days = Math.floor(t / (1000 * 60 * 60 * 24));

  // build string
  let timeLeft = [
    days > 1 ? `${days} days`: days > 0 ? `${days} day`: '',
    hours > 1 ? `${hours} hours`: hours > 0 ? `${hours} hour`: '',
    minutes > 1 ? `${minutes} minutes`: minutes > 0 ? `${minutes} minute`: '',
    // seconds > 1 ? `${seconds} seconds`: seconds > 0 ? `${seconds} second`: ''
  ];

  // and add oxford comma to the end
  if (timeLeft.length > 1) {
    timeLeft[timeLeft.length - 1] = `and ${timeLeft[timeLeft.length - 1]}`;
  }

  return timeLeft.filter(k => k).join(timeLeft.length > 3 ? ', ': ' ');
}
