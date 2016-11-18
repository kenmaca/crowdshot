import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Alert
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import Field from './Field';
import Icon from 'react-native-vector-icons/FontAwesome';
import CircleIcon from './CircleIcon';

export default class CardSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardSelected: null
    };
  }

  render() {
    return (
      <Field
        {...this.props}>
        <TouchableOpacity
          onPress={() => Actions.paymentMethods({
            onSelected: cardSelected => {
              this.setState({
                cardSelected: cardSelected
              });

              // pass to outer callback
              this.props.onSelected(cardSelected);
            }
          })}
          style={styles.touchable}>
          {
            this.state.cardSelected
            ? (
              <View style={styles.container}>
                <Text style={styles.textContainer}>
                  <Text style={styles.bold}>
                    {(() => {
                      switch(this.state.cardSelected.type) {
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
                    {this.state.cardSelected.lastFour}
                  </Text>
                </Text>
                <Icon
                  style={styles.cardType}
                  size={24}
                  name={(() => {
                    switch(this.state.cardSelected.type) {
                      case 1: return 'cc-mastercard';
                      case 2: return 'cc-amex';
                      default: return 'cc-visa';
                    }
                  })()}
                  color={Colors.Text} />
              </View>
            ): (
              <View style={styles.container}>
                <Text style={styles.textContainer}>
                  Select a Payment Method
                </Text>
                <CircleIcon
                  style={styles.cardType}
                  size={18}
                  color={Colors.ModalBackground}
                  checkColor={Colors.AlternateText}
                  icon='arrow-forward' />
              </View>
            )
          }
        </TouchableOpacity>
      </Field>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: Sizes.InnerFrame
  },

  textContainer: {
    color: Colors.Text
  },

  cardType: {
    marginLeft: Sizes.InnerFrame
  },

  bold: {
    fontWeight: '700'
  }
})
