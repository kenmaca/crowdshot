import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';

export default class TitleBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // methods
    this.clearLoader = this.clearLoader.bind(this);
  }

  clearLoader() {
    this.setState({
      loaded: true
    });
  }

  render() {
    return (
      <View style={[
        styles.container,
        this.props.style
      ]}>
        <Animatable.Text
          animation='fadeInDown'
          duration={500}
          style={styles.title}>
          {this.props.title}
        </Animatable.Text>
        {
          this.props.clearLoader && !this.state.loaded
          ? (
            <Progress.Bar
              animated
              indeterminate
              width={Sizes.Width}
              height={3}
              borderWidth={0}
              borderRadius={0}
              color={Colors.Primary} />
          ): (
            <View style={styles.loaderPlaceholder} />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: Sizes.InnerFrame * 4.5,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H1,
    fontWeight: '300',
    marginLeft: Sizes.OuterFrame,
    marginBottom: Sizes.InnerFrame
  },

  loaderPlaceholder: {
    height: 3
  }
});
