import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, TouchableOpacity
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
import Swipeout from 'react-native-swipeout';
import BillingCard from '../../components/payment/BillingCard';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import CircleIcon from '../../components/common/CircleIcon';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawBilling: [],
      billing: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/billing`
    );
  }

  componentDidMount() {
    this.listener = this.ref.on('child_added', data => {
      if (data.exists()) {
        let billing = [...this.state.rawBilling, data.key];
        this.setState({
          rawBilling: billing,
          billing: this.state.billing.cloneWithRows(billing)
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('child_added', this.listener);
  }

  renderRow(data) {
    return (
      <Swipeout
        right={[
          {
            text: 'Remove',
            color: Colors.Text,
            backgroundColor: Colors.Cancel,
            onPress: () => {
              Alert.alert(
                'Remove this Activity?',
                null,
                [
                  {
                    text: 'Cancel'
                  }, {
                    text: 'Remove',
                    onPress: () => {}
                  }
                ]
              );
            }
          }
        ]}>
        <BillingCard billingId={data} />
      </Swipeout>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Select Payment Method
          </Text>
        </View>
        <View style={styles.content}>
          <ListView
            scrollEnabled={false}
            dataSource={this.state.billing}
            renderRow={this.renderRow} />
        </View>
        <CloseFullscreenButton />
        <TouchableOpacity
          style={styles.addButton}
          onPress={Actions.newPayment}>
          <CircleIcon
            icon='add'
            color={Colors.Transparent}
            checkColor={Colors.Text}
            shadowStyle={styles.addButtonShadow}
            size={50} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  addButton: {
    top: Sizes.InnerFrame,
    right: 0,
    position: 'absolute'
  },

  addButtonShadow: {
    shadowColor: Colors.Overlay,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});
