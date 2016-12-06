import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TextInput, Keyboard, TouchableWithoutFeedback, Alert,
  Modal
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';

// components
import Button from '../../components/common/Button';
import Avatar from '../../components/profiles/Avatar';
import TitleBar from '../../components/common/TitleBar';
import CircleIcon from '../../components/common/CircleIcon';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import InputSectionHeader from '../../components/common/InputSectionHeader';
import ProgressBlocker from '../../components/common/ProgressBlocker';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: null,
      processing: false,
      isContest: false,
      isResolved: false,
      involvedId: null
    };

    this.submit = this.submit.bind(this);
  }



  submit() {
    // block view as we submit the report
    this.setState({
      processing: true
    });

    // now create it
    let dateCreated = Date.now();
    let reportId = Database.ref('reports').push({
      '.value': {
        dateCreated: dateCreated,
        reason: this.state.reason,
        createdBy: Firebase.auth().currentUser.uid,
        isContest: this.state.isContest,
        involvedId: this.props.involvedId || this.state.involvedId,
        isResolved: false
      },
      '.priority':  -dateCreated
    }).key;

    // and back out
    this.setState({
      reason: null,
      processing: false,
      isContest: false,
      isResolved: false,
      involvedId: this.state.involvedId
    });

    Alert.alert(
      'Submitted!',
      'Your Report has been recived',
      [
        {
          text: 'Done',
          onPress: () => {
            // and back out
            Actions.pop();
          }
        }
      ]
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar title={'Report Problem'} />
        <Modal
          transparent
          visible={this.state.processing}
          onRequestClose={() => true}
          animationType='fade'>
          <ProgressBlocker
            message='Submitting your Report' />
        </Modal>
        <View style={styles.body}>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}>
            <View>
              <Text style={styles.greeting}>
                How are we doing?
              </Text>
              <Text style={styles.description}>
                We want to hear what you love and what
                you think we can do better. We will try
                to resolve every issue at our best.
              </Text>
              <InputSectionHeader
                offset={Sizes.OuterFrame}
                label={"Problem Description"} />
              <TextInput
                underlineColorAndroid={Colors.Transparent}
                style={[styles.inputstyle,
                  {
                    borderColor: this.state.focus
                    ? '#20B2AA'
                    : Colors.SubduedText,
                  }]}
                placeholderStyle={styles.placeholder}
                placeholder={"Describe the problem you see wtihin 140 words"}
                onChangeText={text => this.setState({
                  reason: text
                })}
                multiline={true}
                maxLength={140}
                numberOfLines={4}
                onFocus={(focused) => this.setState({
                  focus: true
                })}
                onEndEditing={(focused) => this.setState({
                  focus: false
                })}
                  />
            </View>
         </TouchableWithoutFeedback>
        </View>
        <Button
          squareBorders
          color={Colors.Primary}
          onPress={() => {
            if (!this.state.reason) {
              Alert.alert('You forgot to enter the reason.')
            } else {
              this.submit()
            }
          }}
          label={"Submit"} />
        <CloseFullscreenButton back />
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

  greeting: {
    marginTop: Sizes.InnerFrame,
    marginLeft: Sizes.OuterFrame,
    marginBottom: Sizes.OuterFrame,
    fontSize: Sizes.H0 * 0.8,
    fontWeight: '800',
    fontStyle: 'italic'
  },

  inputstyle: {
    borderWidth: 1.5,
    fontSize: Sizes.H3,
    textAlign: 'left',
    marginHorizontal: Sizes.InnerFrame,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame/2,
    height: Sizes.Height / 5,
    textAlignVertical: 'top',
    backgroundColor: Colors.ModalForeground,
    fontWeight: '100'
  },

  placeholderStyle: {
    fontSize: Sizes.H3
  },

  description: {
    marginLeft: Sizes.OuterFrame,
    marginRight: Sizes.OuterFrame,
    color: Colors.AlternateText,
    fontWeight: '100',
    fontSize: Sizes.H3,
    marginBottom: Sizes.OuterFrame,
    fontStyle: 'italic'
  },

  submittedCotainer: {
    height: Sizes.Height,

  },

  submitted: {
    flex: 1,
    alignItems: 'center',
    marginTop: Sizes.Height / 5,
    backgroundColor: Colors.ModalForeground
  },

  submittedMessage: {
    marginTop: 30,
    paddingHorizontal: Sizes.OuterFrame *2,
    fontSize: Sizes.H2,
    fontWeight: '300'
  }

});
