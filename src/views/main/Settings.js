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
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };

    this.ref = Database.ref(
      `profiles/${Firebase.auth().currentUser.uid}`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          user: data.val()
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Settings
          </Text>
        </View>
        <View style={styles.content}>

        </View>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  titleContainer:{
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Sizes.InnerFrame,
    height: Sizes.NavHeight,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H3
  }
});
