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
import PaymentCard from '../../components/payment/PaymentCard';

export default class PaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `billing/${
        this.props.billingId
      }`
    );
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

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title={
          `Visa ending in ${
            this.state.lastFour || '0000'
          }`
        } />
        <View style={styles.content}>
          <PaymentCard {...this.state} />
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
    backgroundColor: Colors.Foreground,
    padding: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame * 2,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
