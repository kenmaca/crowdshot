import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ScrollView, ListView,
  TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';
import Database from '../../utils/Database';

// components
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import ContestCard from '../../components/lists/ContestCard';

export default class ContestDetail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ContestCard contestId={this.props.contest.contestId}/>
        <CloseFullscreenButton/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignSelf: 'stretch',
  },

});
