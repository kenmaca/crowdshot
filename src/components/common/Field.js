import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Icon from 'react-native-vector-icons/MaterialIcons';
import Divider from './Divider';

/**
 * Generic full span line for Fields. Usually used in larger
 * enclosing Components to achieve a standardized look and feel.
 */
export default class Field extends Component {
  constructor(props) {
    super(props);
    this.setNativeProps = this.setNativeProps.bind(this);
  }

  setNativeProps(props) {
    this.refs.c && this.refs.c.setNativeProps(props);
  }

  render() {
    return (
      <View
        ref='c'
        style={[
          styles.container,
          (this.props.noMargin || !this.props.isBottom) && {marginBottom: 0},
        ]}>
        {this.props.isTop && (<Divider />)}
        <View style={[
          styles.innerContainer,
          this.props.color && {backgroundColor: this.props.color}
        ]}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {this.props.label || this.props.placeholder}
            </Text>
            {this.props.subtitle && (
              <Text style={[
                styles.subtitle,
                this.props.subtitleColor && {
                  color: this.props.subtitleColor
                }
              ]}>
                {this.props.subtitle}
              </Text>
            )}
          </View>
          {this.props.children}
        </View>
        <Divider
          style={[
            !this.props.isBottom && styles.middle,
            this.props.noLine && {height: 0}
          ]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.OuterFrame,
    flexDirection: 'column',
    alignSelf: 'stretch'
  },

  innerContainer: {
    backgroundColor: Colors.Foreground,
    paddingLeft: Sizes.OuterFrame,
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame,
    flexDirection: 'row',
    alignItems: 'center'
  },

  labelContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  label: {
    color: Colors.Text,
    fontSize: Sizes.Text,
    fontWeight: '500'
  },

  subtitle: {
    color: Colors.SubduedText,
    fontSize: Sizes.SmallText,
    fontStyle: 'italic'
  },

  icon: {
    marginTop: 1,
    marginRight: 5
  },

  middle: {
    marginLeft: Sizes.OuterFrame
  }
});
