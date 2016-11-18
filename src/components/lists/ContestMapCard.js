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
import ContestProgressBar from '../contests/ContestProgressBar';
import CircleIcon from '../common/CircleIcon';

export default class ContestMapCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.ref = Database.ref(
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
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  render() {
    return (
      (
        this.state.referencePhotoId
        && Date.now() < this.state.endDate
        && !this.state.isComplete
        && !this.state.isCancelled
      ) ? (
        <Photo
          photoId={this.state.referencePhotoId}
          style={styles.container}>
          <View style={styles.header}>
            <CircleIcon
              icon='arrow-forward' />
          </View>
          <ContestProgressBar
            start={this.state.dateCreated}
            end={this.state.endDate}
            interval={20000} />
        </Photo>
      ): (
        <View />
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: Sizes.Width * 0.75,
    height: Sizes.Width * 0.45,
    borderRadius: 5,
    overflow: 'hidden'
  },

  header: {
    alignItems: 'flex-end',
    padding: Sizes.InnerFrame
  }
});
