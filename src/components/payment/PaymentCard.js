import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Icon from 'react-native-vector-icons/FontAwesome';
import FlipCard from 'react-native-flip-card';

export default class PaymentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      back: false
    };

    // methods
    this.flip = this.flip.bind(this);
  }

  flip() {
    this.setState({
      back: !this.state.back
    });
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.flip}
        style={styles.touchable}>
        <FlipCard
          clickable={false}
          flip={this.state.back}
          flipHorizontal
          flipVertical={false}
          style={styles.flipper}>
          <View style={styles.container}>
            <View style={styles.front}>
              <View style={styles.number}>
                <Text style={styles.numberGroup}>
                  ●●●●
                </Text>
                <Text style={styles.numberGroup}>
                  ●●●●
                </Text>
                <Text style={styles.numberGroup}>
                  ●●●●
                </Text>
                <Text style={styles.numberGroup}>
                  {this.props.lastFour || '0000'}
                </Text>
              </View>
              <View style={styles.lowerContainer}>
                <View style={styles.nameExpiryContainer}>
                  <View style={styles.expiryContainer}>
                    <Text style={styles.expiryTop}>
                      MONTH/YEAR
                    </Text>
                    <View style={styles.expiryBottom}>
                      <Text style={styles.expiryLabel}>
                        {
                          'GOOD THRU\nLAST DAY OF'
                        }
                      </Text>
                      <Text style={styles.expiryValue}>
                        {
                          `${
                            this.props.expiryMonth || '01'
                          }/${
                            this.props.expiryYear || '17'
                          }`
                        }
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardholder}>
                    {
                      (this.props.name || 'Unknown').toUpperCase()
                    }
                  </Text>
                </View>
                <Icon
                  style={styles.type}
                  name={(() => {
                    switch(this.props.type) {
                      case 1: return 'cc-mastercard';
                      case 2: return 'cc-amex';
                      default: return 'cc-visa';
                    }
                  })()}
                  size={36}
                  color={Colors.Text} />
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.back}>
              <View style={styles.stripe} />
              <View style={styles.signature}>
                <Text style={styles.cvv}>
                  ●●●
                </Text>
              </View>
              <View style={styles.shiny} />
            </View>
          </View>
        </FlipCard>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  flipper: {
    borderWidth: 0
  },

  touchable: {
    width: Sizes.Width * 0.8,
    height: Sizes.Width * 0.8 * 0.6,
    backgroundColor: Colors.Transparent
  },

  container: {
    width: Sizes.Width * 0.8,
    height: Sizes.Width * 0.8 * 0.6,
    borderRadius: Sizes.InnerFrame / 2,
    overflow: 'hidden'
  },

  front: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Sizes.InnerFrame / 2,
    backgroundColor: Colors.Primary,
  },

  number: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Sizes.InnerFrame
  },

  numberGroup: {
    marginLeft: Sizes.InnerFrame / 4,
    marginRight: Sizes.InnerFrame / 4,
    fontSize: Sizes.H2,
    color: Colors.Text
  },

  lowerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },

  expiryContainer: {
    marginLeft: Sizes.InnerFrame * 6,
    alignItems: 'flex-end'
  },

  expiryTop: {
    fontSize: Sizes.SmallText / 2,
    color: Colors.Text
  },

  expiryBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },

  expiryLabel: {
    fontSize: Sizes.SmallText / 2,
    color: Colors.Text
  },

  expiryValue: {
    marginTop: Sizes.InnerFrame / 6,
    marginLeft: Sizes.InnerFrame / 3,
    fontSize: Sizes.SmallText,
    color: Colors.Text
  },

  cardholder: {
    marginLeft: Sizes.InnerFrame,
    marginTop: Sizes.InnerFrame / 2,
    fontSize: Sizes.H4,
    color: Colors.Text
  },

  // back card
  back: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.Primary
  },

  stripe: {
    marginTop: Sizes.InnerFrame,
    height: Sizes.InnerFrame * 2,
    alignSelf: 'stretch',
    backgroundColor: Colors.Background
  },

  signature: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: Sizes.InnerFrame / 2,
    width: Sizes.Width * 0.5,
    height: Sizes.Width * 0.5 * 0.2,
    margin: Sizes.InnerFrame,
    marginBottom: Sizes.InnerFrame / 4,
    backgroundColor: Colors.ModalBackground
  },

  cvv: {
    fontSize: Sizes.Text,
    fontWeight: '500',
    fontStyle: 'italic'
  },

  shiny: {
    width: Sizes.Width * 0.2,
    height: Sizes.Width * 0.2 * 0.7,
    borderRadius: Sizes.Width * 0.2 / 2,
    backgroundColor: '#BCC6CC',
    margin: Sizes.InnerFrame,
    marginTop: Sizes.InnerFrame / 4
  }
});
