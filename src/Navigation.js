import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Navigator, Platform, StatusBar, Alert
} from 'react-native';
import {
  Router, Scene, Actions
} from 'react-native-router-flux';
import {
  Colors
} from './Const';
import * as Firebase from 'firebase';
import Database from './utils/Database';

// views
import Loader from './views/main/Loader';
import Login from './views/main/Login';
import EmailLogin from './views/main/EmailLogin';
import Main from './views/main/Main';
import Contestant from './views/main/Contestant';
import NewContest from './views/contests/NewContest';
import NewContestContainer from './views/contests/NewContestContainer';
import Modal from './Modal';
import Profile from './views/profiles/Profile';
import Voting from './views/contests/Voting';
import ContestDetail from './views/contestant/ContestDetail';
import Chat from './views/main/Chat';
import Report from './views/main/Report';
import ChatRoom from './views/main/ChatRoom';
import Settings from './views/main/Settings';
import PaymentMethods from './views/forms/PaymentMethods';
import NewPaymentMethod from './views/forms/NewPaymentMethod';
import NewPayment from './views/forms/NewPayment';
import MapMarkerDrop from './views/forms/MapMarkerDrop';
import NewReferencePhoto from './views/forms/NewReferencePhoto';
import Contest from './views/contests/Contest';
import Entries from './views/contestant/Entries';
import Redeem from './views/contestant/Redeem';
import NewContestPhoto from './views/contestant/NewContestPhoto';
import ConfirmRedeem from './views/contestant/ConfirmRedeem';
import TextEntry from './views/forms/TextEntry';
import CompletedContests from './views/contests/CompletedContests';
import PurchasedPhoto from './views/contests/PurchasedPhoto';
import ContestStatus from './views/contestant/ContestStatus';
import Address from './views/forms/Address';
import PaymentMethod from './views/main/PaymentMethod';
import ProfileEdit from './views/profiles/ProfileEdit';
import Onboarding from './views/onboarding/Onboarding';
import Reward from './views/contestant/Reward';

// components
import TabButton from './components/common/TabButton';
import YourContestsTabButton from './components/contests/YourContestsTabButton';

export default class Navigation extends Component {
  componentDidMount() {
    Platform.OS === 'ios' && StatusBar.setBarStyle('light-content', true);
  }

  render() {
    return (
      <View style={styles.container}>
        <Router>
          <Scene
            hideNavBar
            key='root'>
            <Scene
              initial
              key='loader'
              component={Loader}
              type='replace' />
            <Scene
              key='login'
              component={Login}
              type='replace' />
            <Scene
              key='emailLogin'
              panHandlers={null}
              direction='vertical'
              component={EmailLogin} />
            <Scene
              key='onboarding'
              component={Onboarding}
              type='replace' />
            <Scene
              key='modal'
              component={Modal} />
            <Scene
              key='profile'
              component={Profile} />
            <Scene
              key='voting'
              panHandlers={null}
              component={Voting} />
            <Scene
              key='contestDetail'
              panHandlers={null}
              direction='vertical'
              component={ContestDetail} />
            <Scene
              key='chat'
              component={Chat} />
            <Scene
              key='report'
              component={Report}/>
            <Scene
              key='chatroom'
              component={ChatRoom} />
            <Scene
              key='settings'
              component={Settings} />
            <Scene
              key='paymentMethods'
              component={PaymentMethods} />
            <Scene
              key='paymentMethod'
              component={PaymentMethod} />
            <Scene
              key='newPaymentMethod'
              component={NewPaymentMethod} />
            <Scene
              key='newPayment'
              component={NewPayment} />
            <Scene
              key='mapMarkerDrop'
              component={MapMarkerDrop} />
            <Scene
              key='newReferencePhoto'
              component={NewReferencePhoto} />
            <Scene
              key='entries'
              component={Entries} />
            <Scene
              key='redeem'
              component={Redeem} />
            <Scene
              key='confirmRedeem'
              component={ConfirmRedeem} />
            <Scene
              key='reward'
              component={Reward} />
            <Scene
              key='newContestPhoto'
              component={NewContestPhoto} />
            <Scene
              key='contest'
              component={Contest} />
            <Scene
              key='textEntry'
              component={TextEntry} />
            <Scene
              key='completed'
              component={CompletedContests} />
            <Scene
              key='purchasedPhoto'
              component={PurchasedPhoto}
              panHandlers={null}
              direction='vertical' />
            <Scene
              key='contestStatus'
              component={ContestStatus} />
            <Scene
              key='address'
              component={Address} />
            <Scene
              key='profileEdit'
              component={ProfileEdit} />
            <Scene
              key='newContest'
              component={NewContestContainer}
              panHandlers={null}
              onBack={() => {}} />
            <Scene
              tabs
              tabBarStyle={styles.tabs}
              key='main'
              panHandlers={null}
              type='replace'>
              <Scene
                initial
                key='mainMain'
                title='Your Contests'
                iconName='home'
                onPress={() => {
                  StatusBar.setHidden(false, 'slide');
                  Actions.mainMainView({
                    toggle: true
                  })}
                }
                icon={YourContestsTabButton}>
                <Scene
                  initial
                  hideNavBar
                  key='mainMainView'
                  component={Main}
                  type='refresh' />
              </Scene>
              <Scene
                hideNavBar
                key='mainBroadcast'
                title='Start a Contest'
                iconName='assistant-photo'
                onPress={() => {
                  StatusBar.setHidden(false, 'slide');
                  Actions.mainBroadcastView({
                    launch: true
                  })}
                }
                icon={TabButton}>
                <Scene
                  initial
                  hideNavBar
                  key='mainBroadcastView'
                  component={NewContest}
                  type='refresh' />
              </Scene>
              <Scene
                hideNavBar
                key='mainContestant'
                component={Contestant}
                onPress={() => {
                  StatusBar.setHidden(false, 'slide');
                  Actions.mainContestantView({
                    launch: true
                  })}
                }
                title='Join a Contest'
                iconName='camera'
                icon={TabButton} >
                <Scene
                  initial
                  hideNavBar
                  key='mainContestantView'
                  component={Contestant}
                  type='refresh' />
              </Scene>
            </Scene>
          </Scene>
        </Router>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background
  },

  nav: {
    backgroundColor: Colors.Primary
  },

  navText: {
    color: Colors.Text
  },

  navButtons: {
    tintColor: Colors.Text
  },

  tabs: {
    backgroundColor: Colors.Foreground
  }
});
