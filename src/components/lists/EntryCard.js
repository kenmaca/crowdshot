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

// components
import Photo from '../common/Photo';

export default class EntryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `entries/${
        this.props.contestId
      }/${
        this.props.entryId
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
    return (
      <View style={styles.container}>
        <Photo
          photoId={this.state.photoId}
          style={styles.photo} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    margin: Sizes.InnerFrame / 2,
    marginBottom: 0,
    padding: Sizes.InnerFrame,
    backgroundColor: Colors.Foreground,
    borderRadius: 5
  },

  photo: {
    width: 50,
    height: 50,
    borderRadius: 5
  }
});
