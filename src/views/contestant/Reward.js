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
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Photo from '../../components/common/Photo';
import Button from '../../components/common/Button';
import RadioButton from 'react-native-radio-button';
import InputSectionHeader from '../../components/common/InputSectionHeader';

export default class Reward extends Component {
  render() {
    let cart = this.props.getItemTotal(this.props.rewardId, this.props);
    return (
      <View style={styles.container}>
        <ParallaxScrollView
          backgroundColor={Colors.Background}
          contentBackgroundColor={Colors.ModalBackground}
          parallaxHeaderHeight={Sizes.Height * 0.3}
          renderBackground={() => (
            <Photo
              photoId={this.props.photo}
              style={styles.cover} />
          )}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Photo
                photoId={this.props.thumbnail}
                style={styles.thumbnail} />
              <View style={styles.details}>
                <Text style={styles.title}>
                  {this.props.name}
                </Text>
                <Text style={styles.description}>
                  {this.props.longDescription}
                </Text>
              </View>
            </View>
            <View style={styles.options}>
              <InputSectionHeader
                label='Reward Options' />
              <View style={styles.option}>
                <RadioButton
                  isSelected
                  animation='bounceIn' />
                <View style={styles.optionDetail}>
                  <Text style={styles.optionDetailText}>
                    {
                      `$${
                        (this.props.value * 0.01).toFixed(2)
                      }${
                        this.props.valueDescriptor
                          ? ` ${this.props.valueDescriptor}`
                          : ''
                      } (${
                        cart.quantity
                      })`
                    }
                  </Text>
                  <Text style={styles.quantity}>
                    {
                      `$${
                        (cart.subtotal * 0.01).toFixed(2)
                      }`
                    }
                  </Text>
                </View>
              </View>
              <InputSectionHeader
                label='Other Charges'
                style={styles.sectionHeader} />
              <View style={styles.other}>
                <Text style={styles.optionDetailText}>
                  Shipping
                </Text>
                <Text style={styles.quantity}>
                  {
                    `$${
                      (cart.shipping * 0.01).toFixed(2)
                    }`
                  }
                </Text>
              </View>
              {
                this.props.handling && (
                  <View style={styles.other}>
                    <Text style={styles.optionDetailText}>
                      Handling
                    </Text>
                    <Text style={styles.quantity}>
                      {
                        `$${
                          (cart.handling * 0.01).toFixed(2)
                        }`
                      }
                    </Text>
                  </View>
                )
              }
              <InputSectionHeader
                label='Totals'
                style={styles.sectionHeader} />
              <View style={styles.other}>
                <Text style={styles.optionDetailText}>
                  Total Cost
                </Text>
                <Text style={styles.quantity}>
                  {
                    `$${
                      (cart.total * 0.01).toFixed(2)
                    }`
                  }
                </Text>
              </View>
            </View>
          </View>
        </ParallaxScrollView>
        <Button
          squareBorders
          onPress={() => {
            this.props.add(
              this.props.rewardId,
              this.props,
              1,
              () => this.setState({
                updated: true
              })
            );
          }}
          label='Redeem this Reward'
          color={Colors.Primary} />
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

  cover: {
    height: Sizes.Height * 0.3,
    alignSelf: 'stretch'
  },

  content: {
    minHeight: Sizes.Height
  },

  header: {
    flexDirection: 'row',
    padding: Sizes.OuterFrame,
    paddingRight: Sizes.OuterFrame * 3,
    backgroundColor: Colors.ModalForeground
  },

  thumbnail: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.Transparent
  },

  details: {
    marginLeft: Sizes.InnerFrame
  },

  title: {
    fontSize: Sizes.H4,
    fontWeight: '500',
    color: Colors.AlternateText
  },

  description: {
    marginTop: Sizes.InnerFrame / 6,
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.SubduedText
  },

  options: {
    flex: 1,
    padding: Sizes.OuterFrame
  },

  option: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: Sizes.InnerFrame,
    marginLeft: Sizes.InnerFrame * 2
  },

  optionDetail: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: Sizes.InnerFrame,
    marginTop: Sizes.InnerFrame / 3,
    justifyContent: 'space-between'
  },

  optionDetailText: {
    fontSize: Sizes.Text,
    fontWeight: '500',
    color: Colors.AlternateText
  },

  quantity: {
    fontSize: Sizes.Text,
    fontWeight: '100',
    color: Colors.SubduedText
  },

  other: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginBottom: Sizes.InnerFrame / 2
  },

  sectionHeader: {
    marginTop: Sizes.OuterFrame
  }
});
