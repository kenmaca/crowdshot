import React, {
  Component
} from 'react';
import {
  AppRegistry, View
} from 'react-native';
import codePush from 'react-native-code-push';

// components
import Navigation from './src/Navigation';

/**
 * iOS specific things should probably only go in this file, and
 * not in any of the files inside /src (which should be platform
 * agnostic).
 */
export default class Crowdshot extends Component {
  render() {
    return (
      <Navigation />
    );
  }
}

// code push
Crowdshot = codePush(Crowdshot);

AppRegistry.registerComponent('Crowdshot', () => Crowdshot);
