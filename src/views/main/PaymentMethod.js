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
    this.delay = setTimeout(
      () => {
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

          this.refs.title.clearLoader();
        });
      },
      500
    );
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
    this.delay && clearTimeout(this.delay);
  }

  renderRow(transactionId) {
    return (
      <Transaction transactionId={transactionId} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          ref='title'
          showLoader
          title='Transaction History' />
        {

          // show balance total if this is an account credit
          this.props.billingId === Firebase.auth().currentUser.uid
          ? (
            <View style={[
              styles.content,
              styles.balance
            ]}>
              <Text style={styles.balanceAmount}>
                {
                  `$${
                    -(
                      (
                        Object.values(this.state.transactions || {}).reduce(
                          (a, b) => a + b,
                          0
                        ) / 100
                      ).toFixed(2)
                    )
                  }`
                }
              </Text>
              <Text style={styles.balanceText}>
                Available
              </Text>
            </View>
          ): (
            <View style={styles.content}>
              <PaymentCard {...this.state} />
            </View>
          )
        }
        <InputSectionHeader
          style={styles.header}
          offset={Sizes.InnerFrame}
          label='Recent Transactions' />
        <ListView
          key={Math.random()}
          scrollEnabled
          dataSource={this.state.transactionDataSource}
          style={styles.transactions}
          renderRow={this.renderRow.bind(this)} />
        <CloseFullscreenButton back />
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
  },

  balance: {
    alignItems: 'flex-end'
  },

  balanceAmount: {
    fontSize: Sizes.H2,
    fontWeight: '500',
    color: Colors.Primary
  },

  balanceText: {
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.Text
  },

  header: {
    marginTop: Sizes.InnerFrame
  },

  transactions: {
    flex: 1
  }
});
