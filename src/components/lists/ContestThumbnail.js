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
import CircleIcon from '../common/CircleIcon';

export default class ContestThumbnail extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // database
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
      <Photo
        style={[
          styles.container,
          this.props.size && {
            width: this.props.size,
            height: this.props.size
          }
        ]}
        photoId={this.state.photoId}>
        {
          this.state.selected === true && (
            <CircleIcon
              style={styles.statusIcon} />
          ) || this.state.selected === false && (
            <View style={[
              styles.rejectedOverlay,
              this.props.rejectedOverlay && {
                backgroundColor: this.props.rejectedOverlay
              }
            ]} />
          )
        }
      </Photo>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Sizes.InnerFrame * 4,
    height: Sizes.InnerFrame * 4,
    margin: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },

  statusIcon: {
    margin: 5
  },

  rejectedOverlay: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: Colors.BackgroundOverlay
  }
});
