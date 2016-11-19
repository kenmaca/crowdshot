import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TextInput
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';

// components
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import Field from '../../components/common/Field';
import Button from '../../components/common/Button';

export default class TextEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      height: 20
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {this.props.title}
          </Text>
        </View>
        <View style={styles.content}>
          <Field
            isBottom
            label={this.props.label || 'Message'}
            subtitle={this.props.subtitle}
            style={styles.field}>
            <TextInput
              multiline
              autoFocus
              value={this.state.value}
              placeholderTextColor={Colors.SubduedText}
              onContentSizeChange={e => this.setState({
                height: e.nativeEvent.contentSize.height
              })}
              onChangeText={text => this.setState({
                value: text
              })}
              style={[
                styles.input,
                {
                  height: this.state.height
                }
              ]} />
          </Field>
        </View>
        <Button
          onPress={() => {
            Actions.pop();
            this.props.onSubmit && this.props.onSubmit(this.state.value);
          }}
          color={Colors.Primary}
          label={this.props.buttonLabel || 'Submit'} />
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.Background
  },

  titleContainer:{
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Sizes.InnerFrame,
    height: Sizes.NavHeight,
    backgroundColor: Colors.Foreground
  },

  title: {
    color: Colors.Text,
    fontSize: Sizes.H3
  },

  content: {
    alignSelf: 'stretch'
  },

  field: {
    alignSelf: 'stretch'
  },

  input: {
    flex: 1,
    top: -Sizes.InnerFrame / 2.5,
    marginLeft: Sizes.InnerFrame,
    color: Colors.Text,
    fontSize: Sizes.Text
  }
});
