import React, {
  Component
} from 'react';
import {
  StyleSheet, Switch, View
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import Field from './Field';

export default class Toggle extends Component {
  render() {
    return (
      <Field
        {...this.props}>
        <View style={styles.container}>
          <Switch
            value={this.props.active}
            onValueChange={
              value => this.props.onChange && this.props.onChange(
                value
              )
            } />
        </View>
      </Field>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: Sizes.OuterFrame
  }
});
