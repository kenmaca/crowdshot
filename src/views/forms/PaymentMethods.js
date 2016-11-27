import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, ListView, TouchableOpacity,
  Alert
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
import TitleBar from '../../components/common/TitleBar';
import Swipeout from 'react-native-swipeout';
import BillingCard from '../../components/payment/BillingCard';
import CloseFullscreenButton from '../../components/common/CloseFullscreenButton';
import CircleIcon from '../../components/common/CircleIcon';
import Divider from '../../components/common/Divider';

export default class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blob: {},
      billing: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };

    this.ref = Database.ref(
      `profiles/${
        Firebase.auth().currentUser.uid
      }/billing`
    );

    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      let blob = data.val() || {};
      this.setState({
        blob: blob,
        billing: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        }).cloneWithRows(
          Object.keys(blob)
        )
      });
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
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
                'Remove this Card?',
                null,
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  }, {
                    text: 'Remove',
                    onPress: () => {
                      Database.ref(
                        `profiles/${
                          Firebase.auth().currentUser.uid
                        }/billing/${
                          data
                        }`
                      ).remove();
                      Database.ref(
                        `billing/${data}`
                      ).remove();
                    }
                  }
                ]
              );
            }
          }
        ]}>
        <BillingCard
          onPress={this.props.onSelected}
          billingId={data} />
      </Swipeout>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleBar
          title={
            this.props.title || 'Select Payment Method'
          } />
        <View style={styles.content}>
          <ListView
            scrollEnabled={false}
            dataSource={this.state.billing}
            renderRow={this.renderRow} />
          <TouchableOpacity
            style={styles.addContainer}
            onPress={Actions.newPaymentMethod}>
            <CircleIcon
              color={Colors.AlternateText}
              icon='add'
              size={24} />
            <Text style={styles.addContainerText}>
              Add a new Payment Method
            </Text>
          </TouchableOpacity>
        </View>
        <CloseFullscreenButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ModalBackground
  },

  addContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: Sizes.OuterFrame,
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame,
    backgroundColor: Colors.Transparent
  },

  addContainerText: {
    marginLeft: Sizes.InnerFrame,
    color: Colors.AlternateText
  }
});
