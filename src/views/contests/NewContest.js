import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, Modal, Image
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
import * as Animatable from 'react-native-animatable';
import Button from '../../components/common/Button';
import OutlineCircleIcon from '../../components/common/OutlineCircleIcon';

export default class NewContest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../../res/img/onboarding/nex.png')}
          style={styles.image} />
        <View style={styles.header}>
          <Text style={[
            styles.text,
            styles.title
          ]}>
            We'll need a bit of information before we
            can start
          </Text>
        </View>
        <View style={styles.taskContainer}>
          <Animatable.View
            animation='bounceIn'
            duration={500}>
            <OutlineCircleIcon
              icon='camera-front'
              color={Colors.Background}
              checkColor={Colors.Text}
              size={48} />
          </Animatable.View>
          <View style={styles.task}>
            <Text style={[
              styles.text,
              styles.bold
            ]}>
              Describe the subject
            </Text>
            <Text style={styles.text}>
              Take a reference photo so nearby photographers
              can identify the subject(s) and set some ground
              rules
            </Text>
          </View>
        </View>
        <View style={styles.taskContainer}>
          <Animatable.View
            animation='bounceIn'
            duration={500}
            delay={700}>
            <OutlineCircleIcon
              icon='flag'
              color={Colors.Background}
              checkColor={Colors.Text}
              size={48} />
          </Animatable.View>
          <View style={styles.task}>
            <Text style={[
              styles.text,
              styles.bold
            ]}>
              Tell us where
            </Text>
            <Text style={styles.text}>
              Set a marker on the map indicating where
              photographers should take photos at
            </Text>
          </View>
        </View>
        <View style={styles.taskContainer}>
          <Animatable.View
            animation='bounceIn'
            duration={500}
            delay={1400}>
            <OutlineCircleIcon
              icon='attach-money'
              color={Colors.Background}
              checkColor={Colors.Text}
              size={48} />
          </Animatable.View>
          <View style={styles.task}>
            <Text style={[
              styles.text,
              styles.bold
            ]}>
              Set the bounty
            </Text>
            <Text style={styles.text}>
              Add a cash prize for the best photo. Prizes
              are awarded at the end only if we get you
              photos
            </Text>
          </View>
        </View>
        <Animatable.View
          animation='bounceIn'
          duration={500}
          delay={2100}
          style={styles.buttonContainer}>
          <Button
            label='Get started'
            onPress={() => this.setState({
              visible: true
            })}
            color={Colors.Primary}
            style={styles.button} />
        </Animatable.View>
        <Modal
          transparent
          animationType='fade'
          visible={this.state.visible}>
          <View style={styles.modal}>
            <Animatable.View
              animation='zoomInUp'
              duration={800}
              delay={100}
              onAnimationEnd={() => {
                Actions.newPayment({
                  animation: 'fade'
                });
                this.setState({
                  visible: false
                });
              }}
              style={styles.overlay} />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: Sizes.OuterFrame,
    backgroundColor: Colors.Background
  },

  image: {
    position: 'absolute',
    top: -Sizes.Width / 1.9,
    right: -Sizes.Width / 2,
    width: Sizes.Width * 1.77,
    height: Sizes.Width,
    tintColor: Colors.Primary
  },

  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.OuterFrame * 50
  },

  overlay: {
    height: Sizes.Height * 4,
    width: Sizes.Height * 4,
    borderRadius: Sizes.Height * 2,
    backgroundColor: Colors.Primary
  },

  header: {
    marginBottom: Sizes.InnerFrame * 2,
    paddingRight: Sizes.Width / 4
  },

  text: {
    color: Colors.Text,
    fontSize: Sizes.Text,
    fontWeight: '100'
  },

  bold: {
    fontWeight: '500',
    marginBottom: Sizes.InnerFrame / 2
  },

  title: {
    fontSize: Sizes.H1
  },

  taskContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingRight: Sizes.OuterFrame * 4,
    marginBottom: Sizes.InnerFrame * 2
  },

  task: {
    marginLeft: Sizes.InnerFrame
  },

  buttonContainer: {
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame * 4,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },

  button: {
    width: Sizes.Width * 0.8
  }
});
