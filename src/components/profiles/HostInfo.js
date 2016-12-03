import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import Avatar from './Avatar';
import InputSectionHeader from '../common/InputSectionHeader';

export default class HostInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `profiles/${
        this.props.profileId
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
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  render() {

    // used to build stats
    let completed = this.state.completedContests || {};
    let cancelled = this.state.cancelledContests || {};
    let contests = {
      ...completed,
      ...cancelled,
      ...(
        this.state.contests || {}
      )
    };

    let cancelledRate = (
      Object.keys(contests).length > 0
      ? +(
        (
          Object.keys(cancelled).length
          / Object.keys(contests).length
        ).toFixed(2)
      ): 0
    );

    return (
      <View style={[
        styles.container,
        this.props.style
      ]}>
        <View style={styles.content}>
          <InputSectionHeader
            style={styles.header}
            label='Hosted by' />
          <Text style={styles.displayName}>
            {this.state.displayName || 'Unknown'}
          </Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>
              {
                `${Object.keys(contests).length || 0} Contests Hosted`
              }
            </Text>
            <Text style={styles.stat}>
              {
                `${Math.round((1 - cancelledRate) * 100)}% Completion`
              }
            </Text>
          </View>
        </View>
        <Avatar
          showRank
          onPress={() => Actions.profile({
            uid: this.props.profileId
          })}
          uid={this.props.profileId}
          size={81} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    padding: Sizes.InnerFrame,
    backgroundColor: Colors.ModalForeground
  },

  content: {
    flex: 1
  },

  header: {
    flex: 1
  },

  displayName: {
    flexWrap: 'wrap',
    fontSize: Sizes.H2,
    fontWeight: '300',
    marginBottom: Sizes.InnerFrame / 2,
    color: Colors.AlternateText
  },

  stats: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  stat: {
    marginRight: Sizes.InnerFrame,
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.AlternateText
  }
});
