import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TextInput
} from 'react-native';
import {
  Sizes, Colors
} from '../../Const';

// components
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Divider from '../../components/common/Divider';

export default class Payment2 extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.intro}>
          <Text style={styles.introText}>
            You will only be charged once your contest is complete.
          </Text>
        </View>
        <View style={styles.ccInput}>
          <Icon
            name='credit-card'
            color={Colors.SubduedText}
            size={18}/>
          <TextInput
            style={styles.textinput}
            keyboardType="number-pad"
            maxLength={12}
            placeholder="1234 5678 9012 3456"
            autoCorrect={false}/>
        </View>
        <View style={styles.divider}>
          <Divider color={Colors.Secondary}/>
        </View>
        <Button
          label='Scan your card'
          color={Colors.Primary}
          squareBorders={10}
          icon='camera'
          fontAwesome
          container={styles.button}/>
        <View style={styles.end}>
          <Icon
            name='lock'
            size={18}
            color={Colors.SubduedText}/>
          <Text style={styles.endText}>
            Your personal information
          </Text>
          <Text style={styles.endText}>
            is kept safe and secure.
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },
  intro: {
    height: 30,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  introText: {
    fontSize: Sizes.Text,
    color: Colors.SubduedText,
    textAlign: 'center'
  },
  ccInput: {
    paddingLeft: Sizes.InnerFrame,
    backgroundColor: Colors.Secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 20,
    alignSelf: 'center'
  },
  textinput: {
    textAlign: 'left',
    height: 35,
    width: Sizes.Width,
    paddingLeft: Sizes.InnerFrame
  },
  divider: {
    margin: 40
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: Sizes.Width/2.5,
    height: 30
  },
  end: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100
  },
  endText: {
    fontSize: Sizes.Text,
    color: Colors.SubduedText,
    fontWeight: '500',
    textAlign: 'center'
  }
})
