import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Animated, PanResponder,
  ListView
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import {
  Colors, Sizes
} from '../../Const';
import * as Firebase from 'firebase';

import CameraView from '../../components/common/CameraView';

export default class Contestant extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <CameraView/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  header: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: Sizes.Width,
    height: Sizes.Height,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  cover: {
    minHeight: Sizes.Height * 0.6,
    alignSelf: 'stretch'
  },

  welcomeTitle: {
    width: Sizes.Width * 0.7,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.Text,
    backgroundColor: Colors.Transparent,
    textAlign: 'center'
  },

  location: {
    marginTop: Sizes.OuterFrame
  },

  headerContent: {
    marginTop: -Sizes.Height * 0.6,
    height: Sizes.Height * 0.6,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Sizes.InnerFrame
  },

  arrowContainer: {
    marginTop: -Sizes.InnerFrame * 10,
    alignItems: 'center'
  },

  arrow: {
    marginBottom: -Sizes.InnerFrame * 1.5
  },

  arrowText: {
    textAlign: 'center',
    fontSize: Sizes.SmallText,
    color: Colors.LightWhiteOverlay,
    backgroundColor: Colors.Transparent
  },

  cardShadow: {
    borderRadius: 5,
    marginTop: Sizes.InnerFrame / 4,
    marginLeft: Sizes.InnerFrame / 4,
    marginRight: Sizes.InnerFrame / 4,
    shadowColor: Colors.DarkOverlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 0
    }
  }
});
