import React, {
  Component
} from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text
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
import CircleIcon from '../common/CircleIcon';
import Divider from '../common/Divider';
import InformationField from '../common/InformationField';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BillingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      billingId: this.props.billingId
    };
    this.ref = Database.ref(
      `billing/${this.props.billingId}`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });
      }
    })
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }

  render() {
    return (
      (

        // either the method is active or it's just account credit
        this.state.active
        || this.props.billingId === Firebase.auth().currentUser.uid
      ) ? (
        <TouchableOpacity
          onPress={() => {

            // exit screen
            Actions.pop();

            // and used on selected card
            this.props.onPress && this.props.onPress(
              this.state
            );
          }}
          style={styles.container}>
          {

            // don't show icon if this is an internal
            // credit account
            this.props.billingId !== Firebase.auth().currentUser.uid
            ? (
              <View style={styles.content}>
                <Icon
                  style={styles.cardType}
                  name={(() => {
                    switch(this.state.type) {
                      case 1: return 'cc-mastercard';
                      case 2: return 'cc-amex';
                      default: return 'cc-visa';
                    }
                  })()}
                  size={24}
                  color={Colors.Text} />
                <Text style={styles.textContainer}>
                  <Text style={styles.bold}>
                    {(() => {
                      switch(this.state.type) {
                        case 1: return 'MasterCard';
                        case 2: return 'American Express';
                        default: return 'Visa';
                      }
                    })()}
                  </Text>
                  <Text>
                    {' ending in '}
                  </Text>
                  <Text style={styles.bold}>
                    {this.state.lastFour}
                  </Text>
                </Text>
                <CircleIcon
                  size={18}
                  style={styles.button}
                  color={Colors.ModalBackground}
                  checkColor={Colors.AlternateText}
                  icon='arrow-forward' />
              </View>
            ): (
              <View style={styles.content}>
              <Text style={styles.textContainer}>
                <Text>
                  {'Account Credit — '}
                </Text>
                <Text style={styles.bold}>
                  {
                    `$${
                      -(
                        (
                          Object.values(
                            this.state.transactions || {}
                          ).reduce(
                            (a, b) => a + b,
                            0
                          ) / 100
                        ).toFixed(2)
                      )
                    } available`
                  }
                </Text>
              </Text>
              <CircleIcon
                size={18}
                style={styles.button}
                color={Colors.ModalBackground}
                checkColor={Colors.AlternateText}
                icon='arrow-forward' />
              </View>
            )
          }
          <Divider />
        </TouchableOpacity>
      ): (
        <View />
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: Colors.Background
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.OuterFrame,
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame,
    backgroundColor: Colors.Foreground
  },

  cardType: {
    marginRight: Sizes.InnerFrame
  },

  textContainer: {
    flex: 1,
    backgroundColor: Colors.Transparent,
    color: Colors.Text
  },

  bold: {
    fontWeight: '700'
  }
});
