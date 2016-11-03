import React, {
  Component
} from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

/**
 * Displays a Button.
 */
export default class Button extends Component {

  /**
   * Creates a new Button.
   *
   * @param {string} [props.label] - The label to display on this Button.
   * @param {object} [props.style] - The style to override with.
   * @param {string} [props.color] - The color of the Button (background).
   * @param {string} [props.fontColor] - The color of the Button text .
   * @param {number} [props.size] - The font size of the label.
   * @param {function} [props.onPress] - A callback for the onPress event.
   * @param {boolean} [props.shouldBlur] - If this Button is disabled once
   *  pressed.
   * @param {boolean} [props.isDisabled] - Button will become grayed and
   *  unpressable.
   * @param {string} [props.disabledColor] - The color of this Button when its
   *  disabled.
   * @param {string} [props.disabledFontColor] - The color of this Button's text
   *  when disabled.
   */
  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
  }

  componentDidMount() {

    // bind methods
    this.reset = this.reset.bind(this);
  }

  /**
   * Allows this Button to be pressed again.
   */
  reset() {
    this.setState({pressed: false});
  }

  render() {
    return (
      <TouchableOpacity
        hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
        style={[
          styles.container,
          this.props.style,
          this.props.color && {backgroundColor: this.props.color},
          this.props.isDisabled && {
            backgroundColor: this.props.disabledColor || Colors.Disabled
          },
          this.state.pressed && {
            backgroundColor: Colors.Transparent
          },
          this.props.squareBorders && {
            borderRadius: 0
          }
        ]}
        onPress={() => {

          // prevent press event if shouldBlur or isDisabled
          if (
            !(this.props.shouldBlur && this.state.pressed)
            || !(this.props.isDisabled)
          ) {
            this.props.onPress && this.props.onPress();

            // only setState if this Button shouldBlur
            this.props.shouldBlur && this.setState({pressed: true});
          }
        }}>

        {/* show a spinner if blurred */}
        {this.props.shouldBlur && this.state.pressed ?
          (
            <View style={styles.textContainer}>
              <ActivityIndicator
                size={'small'}
                color={
                  this.props.disabledFontColor
                  || this.props.fontColor
                  || Colors.AlternateText
                }
                animating={true} />
            </View>

          ): (
            <View style={styles.textContainer}>
              {

                // icon
                this.props.icon
                && (
                  this.props.fontAwesome
                  && (
                    <FontAwesomeIcon
                      name={this.props.icon}
                      size={this.props.size || Sizes.Text}
                      color={
                        (this.props.isDisabled && this.props.disabledFontColor)
                        || this.props.fontColor
                        || Colors.Text
                      } />
                  ) || (
                    <Icon
                      name={this.props.icon}
                      size={this.props.size || Sizes.Text}
                      color={
                        (this.props.isDisabled && this.props.disabledFontColor)
                        || this.props.fontColor
                        || Colors.Text
                      } />
                  )
                )
              }
              {

                // spacer if both icon and label are used
                this.props.icon && this.props.label && (
                  <View
                    style={styles.spacer} />
                )
              }
              {

                // the label
                this.props.label
                && (
                  <Text style={[
                    styles.text,
                    this.props.size && {fontSize: this.props.size},
                    this.props.fontColor && {color: this.props.fontColor},
                    this.props.isDisabled && {
                      color: this.props.disabledFontColor
                        || this.props.fontColor
                        || Colors.AlternateText
                    }
                  ]}>
                    {this.props.label}
                  </Text>
                )
              }
              {

                // spacer if both rightIcon and label are used
                this.props.rightIcon && this.props.label && (
                  <View
                    style={styles.spacer} />
                )
              }
              {

                // icon
                this.props.rightIcon
                && (
                  this.props.fontAwesome
                  && (
                    <FontAwesomeIcon
                      name={this.props.rightIcon}
                      size={this.props.size || Sizes.Text}
                      color={
                        (this.props.isDisabled && this.props.disabledFontColor)
                        || this.props.fontColor
                        || Colors.Text
                      } />
                  ) || (
                    <Icon
                      name={this.props.rightIcon}
                      size={this.props.size || Sizes.Text}
                      color={
                        (this.props.isDisabled && this.props.disabledFontColor)
                        || this.props.fontColor
                        || Colors.Text
                      } />
                  )
                )
              }
            </View>
          )
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Transparent,
    borderRadius: 50,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 20,
    paddingLeft: 20
  },

  spacer: {
    marginLeft: 5
  },

  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  text: {
    fontSize: Sizes.Text,
    color: Colors.Text,
    fontWeight: '600'
  }
});
