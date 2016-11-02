import React, {
  PropTypes,
} from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Icon from 'react-native-vector-icons/MaterialIcons';

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
  iconName: PropTypes.string
};

const TabButton = props => (
  <View style={{
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Icon
      name={props.iconName}
      size={Sizes.H3}
      color={
        props.selected ? Colors.Primary: Colors.Text
      } />
    <Text
      style={{
        fontSize: Sizes.SmallText,
        color: props.selected ? Colors.Primary: Colors.Text
      }}>
      {props.title}
    </Text>
  </View>
);

TabButton.propTypes = propTypes;

export default TabButton;
