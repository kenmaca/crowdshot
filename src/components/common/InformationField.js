import React, {
  Component
} from 'react';
import {
  StyleSheet, View, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';

// components
import Field from './Field';
import CircleIcon from './CircleIcon';

/**
 * Creates a line of Information wrapped in a InputField.
 *
 * @param {string} props.info - The information.
 */
export default class InformationField extends Component {
  render() {
    return (
      <Field {...this.props}>
        <View style={[
          styles.info,
          this.props.style
        ]}>
          <Text style={styles.infoText}>
            {this.props.info}
          </Text>
          {
            this.props.pressable && (
              <CircleIcon
                size={18}
                style={styles.button}
                icon='arrow-forward'
                color={Colors.ModalBackground}
                checkColor={Colors.AlternateText} />
            )
          }
        </View>
      </Field>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingRight: Sizes.OuterFrame,
    backgroundColor: Colors.Transparent
  },

  infoText: {
    fontSize: Sizes.Text,
    color: Colors.Text,
    textAlign: 'right',
  },

  button: {
    marginLeft: Sizes.InnerFrame / 2
  }
});
