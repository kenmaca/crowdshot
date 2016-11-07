import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Modal, TouchableHighlight
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import Photo from './Photo';

export default class PhotoGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      initialPage: 0,
      visible: false
    };
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props) {

    // reset photos to prevent adding
    this.setState({
      photos: []
    });
    for (let photo of props.photoIds) {
      Database.ref(
        `photos/${photo}/url`
      ).once('value', data => {
        data.exists() && this.setState({
          photos: [...this.state.photos, data.val()]
        });
      });
    }
  }

  render() {
    return (
      <View style={[
        styles.container,
        this.props.width && {
          width: this.props.width
        },
        this.props.style
      ]}>
        {this.state.photos.map((photoUri, i) => {
          return (
            <TouchableHighlight
              key={i}
              onPress={Actions.contestPhotos}>
              <Photo
                style={[
                  styles.photo,
                  this.props.width && {
                    width: (
                      (this.props.width / this.props.eachRow) - 2
                    ),
                    height: (
                      (this.props.width / this.props.eachRow) - 2
                    )
                  }
                ]}
                uri={photoUri} />
            </TouchableHighlight>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: -1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },

  photo: {
    margin: 1,
    height: 100,
    width: 100
  }
});
