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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
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
        <View style={styles.horizontal}>
          <Animatable.Text
            animation='fadeInDown'
            duration={500}
            style={styles.title}>
            {this.props.title}
          </Animatable.Text>
          <View style={styles.rightContainer}>
            {this.props.rightIcon ?
            <FontAwesomeIcon
              name={this.props.rightIcon}
              color={Colors.Text}
              size={Sizes.H1} />
            : <View/>}
            <Text style={styles.rightTitle}>
              {this.props.rightTitle}
            </Text>
          </View>
        </View>
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
  container: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: Sizes.InnerFrame * 4.5,
    backgroundColor: Colors.Foreground
  },

  horizontal: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.InnerFrame
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H1,
    fontWeight: '300',
    marginLeft: Sizes.OuterFrame,
    marginBottom: Sizes.InnerFrame
  },

  rightTitle: {
    color: Colors.Text,
    fontSize: Sizes.H1,
    fontWeight: '300',
    marginRight: Sizes.OuterFrame,
    marginLeft: Sizes.InnerFrame/2
  },

  loaderPlaceholder: {
    height: 3
  }
});
