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
import MapView from 'react-native-maps';
import Avatar from '../profiles/Avatar';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default class ContestMapMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `contests/${this.props.contestId}`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });
      }
    })
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  render() {
    return (
      (
        // conditions to show the contest
        this.state.createdBy
        && !this.state.isComplete
        && !this.state.isCancelled
        && Date.now() < this.state.endDate
      ) ? (
        <MapView.Marker
          centerOffset={{
            x: 0,
            y: -Sizes.InnerFrame * 2
          }}
          coordinate={this.props.coordinate}
          onPress={() => {
            if (this.state.createdBy === Firebase.auth().currentUser.uid) {
              Actions.contest({
                contestId: this.props.contestId
              });
            } else {
              Actions.contestDetail({
                contestId: this.props.contestId
              });
            }
          }}>
          <View style={styles.shadow}>
            <View style={styles.container}>
              <View style={styles.outline}>
                <View style={[
                  styles.content,
                  this.state.createdBy === Firebase.auth().currentUser.uid && {
                    backgroundColor: Colors.Primary
                  }
                ]}>
                  <Avatar
                    size={48}
                    uid={this.state.createdBy} />
                  <View style={styles.bounty}>
                    <Text style={styles.bountyValue}>
                      ${this.state.bounty}
                    </Text>
                    <View style={styles.bountyAmountContainer}>
                      <Text style={styles.bountyAmount}>
                        {
                          Object.keys(
                            this.state.prizes
                          ).length || 1
                        }
                      </Text>
                      <FontAwesomeIcon
                        name='trophy'
                        size={10}
                        color={Colors.Trophy} />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.pin} />
            </View>
          </View>
        </MapView.Marker>
      ): (
        <View />
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },

  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    padding: Sizes.InnerFrame / 4,
    backgroundColor: Colors.ModalBackground
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: Colors.Foreground
  },

  pin: {
    top: -1,
    width: 0,
    height: 0,
    backgroundColor: Colors.Transparent,
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderLeftColor: Colors.Transparent,
    borderRightColor: Colors.Transparent,
    borderTopColor: Colors.ModalBackground
  },

  bounty: {
    marginLeft: Sizes.InnerFrame / 2,
    marginRight: Sizes.InnerFrame
  },

  bountyValue: {
    fontSize: Sizes.H3,
    fontWeight: '500',
    color: Colors.Text
  },

  bountyAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  bountyAmount: {
    marginRight: Sizes.InnerFrame / 4,
    fontSize: Sizes.Text,
    color: Colors.Text
  },

  shadow: {
    backgroundColor: Colors.Transparent,
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: Sizes.InnerFrame / 2,
      width: 0
    }
  }
});
