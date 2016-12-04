import React, {
  Component
} from 'react';
import {
  StyleSheet, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {
  Colors
} from '../../Const';

export default class CircleIcon extends Component {
  render() {
    return (
      <View style={[
        styles.container,
        this.props.size && {
          borderRadius: this.props.size / 2,
          width: this.props.size,
          height: this.props.size
        },
        this.props.color && {
          backgroundColor: this.props.color
        },
        this.props.style
      ]}>
        <View>
          {
            this.props.fontAwesome
            ? (
              <FontAwesomeIcon
                style={this.props.shadowStyle}
                size={this.props.size && (this.props.size * 0.6) || 12}
                name={this.props.icon || 'check'}
                color={
                  this.props.checkColor
                  ? this.props.checkColor
                  : Colors.Text
                } />
            ): (
              <Icon
                style={this.props.shadowStyle}
                size={this.props.size && (this.props.size * 0.6) || 12}
                name={this.props.icon || 'check'}
                color={
                  this.props.checkColor
                  ? this.props.checkColor
                  : Colors.Text
                } />
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: 20,
    height: 20,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
})
