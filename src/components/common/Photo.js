import React, {
  Component
} from 'react';
import {
  Image, View, ActivityIndicator, StyleSheet
} from 'react-native';
import Database from '../../utils/Database';
import {
  Colors
} from '../../Const';

// components
import * as Animatable from 'react-native-animatable';

/**
 * Displays a Photo from either a Photo item in Firebase or a direct URI.
 */
export default class Photo extends Component {

  /**
   * @param {string} [props.uri] - The URI of the Photo.
   * @param {string} [props.photoId] - The PhotoId, if URI needs to be resolved
   *  through a Firebase object.
   */
  constructor(props) {
    super(props);
    this.state = {
      source: null,

      // used to help prevent rerendering on new same props unchanged
      initialized: false
    };

    this.setNativeProps = this.setNativeProps.bind(this);
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props) {

    // prevent the same uri to rerender
    if (
      props.uri
      && (
        (props.uri != this.props.uri)
        || !this.state.initialized
      )
    ) {
      this.setState({
        source: props.uri
      });

    // prevent the same photoId to rerender
    } else if (
      props.photoId
      && (
        (props.photoId != this.props.photoId)
        || !this.state.initialized
      )
    ) {

      // remove previous listener
      this.componentWillUnmount();

      // add new listener
      this.ref = Database.ref(
        `photos/${props.photoId}/url`
      );
      this.listener = this.ref.on('value', data => {
        data.exists() && this.setState({
          source: data.val()
        });
      });
    }

    this.setState({
      initialized: true
    });
  }

  componentWillUnmount() {
    this.ref && this.ref.off('value', this.listener);
  }

  setNativeProps(props) {
    this.c && this.c.setNativeProps(props);
  }

  render() {
    return (
      <Animatable.View
        animation={this.props.animation}
        duration={this.props.duration}
        delay={this.props.delay}>
        {
          this.state.source
          ? (
            <View
              ref={c => this.c = c}
              {...this.props}
              style={[
                this.props.style,
                styles.zeroPadding
              ]} >
              <Image
                ref={c => this.c = c}
                {...this.props}
                style={[
                  this.props.style,
                  styles.container,
                ]}
                resizeMethod={'resize'}
                source={{uri: this.state.source}}
                onLoadEnd={this.props.onLoadEnd} />
            </View>
          ): (
            <View
              ref={c => this.c = c}
              {...this.props}
              style={[
                styles.emptyContainer,
                this.props.style
              ]} />
          )
        }
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: Colors.Foreground
  },

  container: {
    backgroundColor: Colors.Transparent
  },

  zeroPadding: {
    padding: 0
  }
});
