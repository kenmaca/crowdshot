import React, {
  Component
} from 'react';
import {
  View, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Database from '../../utils/Database';
import * as Firebase from 'firebase';

// components
import TabButton from '../common/TabButton';

export default class YourContestsTabButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/contests`
    )
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      this.setState({
        contests: Object.keys(data.val() || {}).length
      });
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  render() {
    return (
      <TabButton
        {...this.props}
        unread={this.state.contests} />
    );
  }
}
