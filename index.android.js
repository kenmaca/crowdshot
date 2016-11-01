import React, {
  Component
} from 'react';
import {
  AppRegistry, View
} from 'react-native';

// components
import Navigation from './src/Navigation';

/**
 * Android specific things should probably only go in this file, and
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

AppRegistry.registerComponent('crowdshot', () => Crowdshot);
