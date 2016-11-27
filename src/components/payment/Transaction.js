import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Database from '../../utils/Database';
import DateFormat from 'dateformat';

export default class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.ref = Database.ref(
      `transactions/${
        this.props.transactionId
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
        <View style={styles.detail}>
          <Text style={styles.date}>
            {
              DateFormat(
                this.state.dateCreated,
                'mmmm dS, yyyy, h:MMTT'
              )
            }
          </Text>
          <Text style={styles.description}>
            {
              this.state.description || 'Charge processed by Stripe'
            }
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            {`$${Math.round(this.state.value / 100, 2)}`}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    backgroundColor: Colors.ModalForeground,
    marginBottom: Sizes.InnerFrame / 6,
    padding: Sizes.InnerFrame
  },

  date: {
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.SubduedText
  },

  description: {
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.AlternateText
  },

  amount: {
    fontSize: Sizes.H3,
    fontWeight: '500',
    color: Colors.Primary
  }
});
