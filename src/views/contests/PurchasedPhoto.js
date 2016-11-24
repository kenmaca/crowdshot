import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, CameraRoll, Alert
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';
import RNFetchBlob from 'react-native-fetch-blob';

// components
import PhotoView from 'react-native-photo-view';
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import HeaderButton from '../../components/common/HeaderButton';
import Avatar from '../../components/profiles/Avatar';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null
    };

    this.ref = Database.ref(
      `photos/${
        this.props.photoId
      }/url`
    );

    // methods
    this.download = this.download.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          uri: data.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  download() {
    if (this.state.uri) {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg'
      }).fetch('GET', this.state.uri).then(photo => {
        CameraRoll.saveToCameraRoll(
          photo.path(),
          'photo'
        ).then(result => {
          Alert.alert(
            'Photo saved successfully',
            null,
            [
              {
                text: 'OK',
                onPress: Actions.pop
              }
            ]
          );
        }).catch(err => {
          Alert.alert(
            'Couldn\'t save your photo',
            'Please try again'
          );
        }).then(result => {
          photo.flush();
        });
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.uri ? (
            <PhotoView
              source={{
                uri: this.state.uri
              }}
              minimumZoomScale={0.8}
              maximumZoomScale={3}
              androidScaleType='center'
              style={styles.photo} />
          ): (
            <View />
          )
        }
        <CloseFullscreenButton />
        {
          this.props.contestantId && (
            <View style={styles.buttons}>
              <Avatar
                outline
                outlineColor={Colors.Text}
                size={28}
                uid={this.props.contestantId}
                onPress={() => Actions.profile({
                  uid: this.props.contestantId
                })} />
              <HeaderButton
                icon='share' />
              <HeaderButton
                onPress={this.download}
                icon='file-download' />
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  photo: {
    flex: 1,
    alignSelf: 'stretch',
    width: Sizes.Width,
    height: Sizes.Height
  },

  buttons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    padding: Sizes.InnerFrame,
    alignItems: 'center'
  }
});
