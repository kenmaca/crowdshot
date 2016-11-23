import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ScrollView
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
import TitleBar from '../../components/common/TitleBar';
import ContestProgressBar from '../../components/contests/ContestProgressBar';
import InputSectionHeader from '../../components/common/InputSectionHeader';
import Photo from '../../components/common/Photo';
import CircleIcon from '../../components/common/CircleIcon';
import Divider from '../../components/common/Divider';
import Avatar from '../../components/profiles/Avatar';

export default class ContestStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: {}
    };

    this.ref = Database.ref(
      `contests/${
        this.props.contestId
      }`
    );

    this.entriesRef = Database.ref(
      `entries/${
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

    this.entriesListener = this.entriesRef.on('value', data => {
      if (data.exists()) {
        this.setState({
          entries: data.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.entriesListener && this.entriesRef.off('value', this.entriesListener);
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title='Contest Results' />
        <ContestProgressBar
          style={styles.progress}
          start={this.state.dateCreated}
          end={this.state.endDate}
          interval={2000} />
        <ScrollView style={styles.content}>
          <InputSectionHeader label='Instructions' />
          <Text style={styles.text}>
            {this.state.instructions}
          </Text>
          <InputSectionHeader
            style={styles.header}
            label='Winners' />
          <View style={styles.prizeContainer}>
            <View style={styles.prize}>
              <View style={styles.avatar}>
                <Avatar
                  uid='ht33R6YWUWQMc8SZb27o9BOzn6G3'
                  size={48} />
              </View>
              <Photo
                photoId='appLoginBackground'
                style={styles.photo} />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.prize}>
              <View style={styles.avatar}>
                <Avatar
                  uid='ht33R6YWUWQMc8SZb27o9BOzn6G3'
                  size={48} />
              </View>
              <Photo
                photoId='appLoginBackground'
                style={styles.photo} />
            </View>
          </View>
        </ScrollView>
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

  progress: {
    backgroundColor: Colors.Foreground
  },

  content: {
    flex: 1,
    padding: Sizes.InnerFrame,
    backgroundColor: Colors.ModalBackground
  },

  text: {
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.AlternateText
  },

  header: {
    marginTop: Sizes.InnerFrame
  },

  prizeContainer: {
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame,
    borderRadius: 5,
    borderColor: Colors.LightOverlay,
    borderWidth: 1
  },

  prize: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  avatar: {
  },

  photo: {
    width: Sizes.Width * 0.6,
    height: Sizes.Width * 0.6,
    borderRadius: 5
  },

  divider: {
    backgroundColor: Colors.LightOverlay,
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.InnerFrame,
    height: 1
  }
});
