import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
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
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import SingleLineInput from '../../components/common/SingleLineInput';
import Button from '../../components/common/Button';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.ref = Database.ref(
      `profiles/${Firebase.auth().currentUser.uid}`
    );

    // methods
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onCountryChange = this.onCountryChange.bind(this);
    this.onPostalChange = this.onPostalChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  onAddressChange(address) {
    this.setState({
      address: address
    });
  }

  onCityChange(city) {
    this.setState({
      city: city
    });
  }

  onRegionChange(region) {
    this.setState({
      region: region
    });
  }

  onCountryChange(country) {
    this.setState({
      country: country
    });
  }

  onPostalChange(postal) {
    this.setState({
      postal: postal
    });
  }

  submit() {
    this.ref.update({
      address: this.state.address,
      city: this.state.city,
      region: this.state.region,
      country: this.state.country,
      postal: this.state.postal
    }).then(result => {
      Actions.pop();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title='Update Shipping Address' />
        <View style={styles.content}>
          <SingleLineInput
            autoCapitalize='words'
            onChangeText={this.onAddressChange}
            value={this.state.address}
            label='Address' />
          <SingleLineInput
            autoCapitalize='words'
            onChangeText={this.onCityChange}
            value={this.state.city}
            label='City' />
          <SingleLineInput
            autoCapitalize='words'
            onChangeText={this.onRegionChange}
            value={this.state.region}
            label='Province/State' />
          <SingleLineInput
            autoCapitalize='words'
            onChangeText={this.onCountryChange}
            value={this.state.country}
            label='Country' />
          <SingleLineInput
            isBottom
            onChangeText={this.onPostalChange}
            value={this.state.postal}
            label='Postal/ZIP Code' />
          <Button
            onPress={this.submit}
            label='Update Address'
            color={Colors.Primary} />
        </View>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  content: {
    alignItems: 'center'
  }
});
