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

export default class UserSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: 'Unknown'
    };

    this.ref = Database.ref(
      `profiles/${this.props.uid}`
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
    return (
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Avatar
            outline
            outlineColor={Colors.ModalBackground}
            onPress={() => Actions.profile({
              uid: this.props.uid
            })}
            size={48}
            uid={this.props.uid} />
        </View>
        <Text style={styles.name}>
          {this.state.displayName}
        </Text>
        <View style={styles.userContainer}>
          <View style={styles.statContainer}>
            <Text style={styles.statTitle}>
              24
            </Text>
            <Text style={styles.statDescription}>
              CONTESTS WON
            </Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statTitle}>
              66%
            </Text>
            <Text style={styles.statDescription}>
              SUCCESS RATE
            </Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statTitle}>
              382
            </Text>
            <Text style={styles.statDescription}>
              PHOTOS
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: Sizes.InnerFrame * 5,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Colors.ModalBackground,
    borderRadius: 5
  },

  avatar: {
    marginTop: -Sizes.InnerFrame * 1.5
  },

  userContainer: {
    flexDirection: 'row',
    padding: Sizes.InnerFrame,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: Colors.Foreground,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },

  name: {
    padding: Sizes.InnerFrame / 2,
    paddingBottom: Sizes.InnerFrame / 1.5,
    fontSize: Sizes.H3,
    fontWeight: '500'
  },

  statContainer: {
  },

  statTitle: {
    fontSize: Sizes.H4,
    fontWeight: '500',
    color: Colors.SubduedText
  },

  statDescription: {
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.SubduedText
  }
});
