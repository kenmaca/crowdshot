import React, {
  Component
} from 'react';
import {
  View, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import ContestCard from '../../components/lists/ContestCard';

export default class Contest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ContestCard {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
