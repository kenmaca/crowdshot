import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TextInput
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
import Button from '../../components/common/Button';
import Avatar from '../../components/profiles/Avatar';
import TitleBar from '../../components/common/TitleBar';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import InputSectionHeader from '../../components/common/InputSectionHeader'

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: ""
    };

    this.ref = Database.ref(
      `report/`
    );
  }


  submit() {

  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title={'Report Problem'} />
        <View style={styles.body}>
          <Text style={styles.description}>
            {"Let us know what\'s wrong. We will deal with"
            + " the issue as soon as possible!"}
          </Text>
          <InputSectionHeader
            offset={Sizes.InnerFrame}
            label={"Problem Description"} />
          <TextInput
            clearButtonMode='always'
            style={styles.inputstyle}
            placeholder={"Describe the problem you are seeing here"}
            onChangeText={text => this.setState({
              reason: text
            })}
            multiline={true}
            numberOfLines={10}
            underlineColorAndroid={Colors.Transparent}
            returnKeyType='done'
             />
        </View>
        <Button
          squareBorders
          color={Colors.Primary}
          onPress={() => this.submit()}
          label={"Submit"} />
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    flex: 1,
    alignSelf: 'stretch',
    paddingTop: Sizes.InnerFrame
  },

  inputstyle: {
    fontSize: Sizes.H3,
    textAlign: 'left',
    marginHorizontal: Sizes.InnerFrame,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame/2,
    height: Sizes.Height*1/3,
    textAlignVertical: 'top',
    backgroundColor: Colors.ModalForeground,
    fontWeight: '100',
  },

  description: {
    marginLeft: Sizes.InnerFrame,
    marginRight: Sizes.InnerFrame,
    color: Colors.AlternateText,
    fontWeight: '100',
    marginBottom: Sizes.InnerFrame
  }

});
