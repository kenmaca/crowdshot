import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView
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
import Transaction from '../../components/payment/Transaction';
import InputSectionHeader from '../../components/common/InputSectionHeader';

export default class PaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionDataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `billing/${
        this.props.billingId
      }`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        let blob = data.val();
        this.setState({
          ...blob,
          transactionDataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          }).cloneWithRows(
            Object.keys(blob.transactions || {})
          )
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  renderRow(transactionId) {
    return (
      <Transaction transactionId={transactionId} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title='Transaction History' />
        <View style={styles.content}>
          <PaymentCard {...this.state} />
        </View>
        <InputSectionHeader
          offset={Sizes.InnerFrame}
          label='Recent Transactions' />
        <ListView
          key={Math.random()}
          scrollEnabled
          dataSource={this.state.transactionDataSource}
          style={styles.transactions}
          renderRow={this.renderRow.bind(this)} />
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
    marginBottom: Sizes.InnerFrame,
    alignItems: 'center',
    justifyContent: 'center'
  },

  transactions: {
    flex: 1
  }
});
