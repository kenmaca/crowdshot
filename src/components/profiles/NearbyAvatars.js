import React, {
  Component
} from 'react';
import {
  View, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import GeoFire from 'geofire';
import Database from '../../utils/Database';

// components
import GroupAvatar from './GroupAvatar';

export default class NearbyAvatars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nearby: {}
    };
  }

  componentDidMount() {
    this.ref = new GeoFire(
      Database.ref('profileLocations')
    ).query({
      center: [
        this.props.latitude,
        this.props.longitude
      ],

      // default 10 km radius
      radius: this.props.radius || 10
    });

    // add when in view
    this.ref.on('key_entered', (key, location, distance) => {
      this.state.nearby[key] = distance;

      // trigger rerender
      this.setState({
        updated: true
      });
    });

    // remove when out
    this.ref.on('key_exited', (key, location, distance) => {
      delete this.state.nearby[key];

      // trigger rerender
      this.setState({
        updated: true
      });
    })
  }

  componentWillUnmount() {
    this.ref.cancel();
  }

  componentWillReceiveProps(props) {
    this.ref.updateCriteria({
      center: [
        props.latitude,
        props.longitude
      ],
      radius: props.radius || this.props.radius
    });
  }

  render() {
    return (
      <GroupAvatar
        {...this.props}
        uids={

          // sorted by closest to center
          Object.keys(this.state.nearby).sort((a, b) => (
            this.state.nearby[a] > this.state.nearby[b]
          ))
        } />
    );
  }
}
