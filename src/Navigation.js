import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Navigator, Platform, StatusBar
} from 'react-native';
import {
  Router, Scene
} from 'react-native-router-flux';
import {
  Colors
} from './Const';

// views
import Loader from './views/main/Loader';
import Login from './views/main/Login';
import Main from './views/main/Main';
import Contestant from './views/main/Contestant';
import NewContest from './views/forms/NewContest';
import Modal from './Modal';
import Profile from './views/profiles/Profile';
import ContestPhotos from './views/contests/ContestPhotos';
import ContestDetail from './views/contestant/ContestDetail';
import Chat from './views/main/Chat';
import Settings from './views/main/Settings';
import Payment from './views/forms/Payment';
import NewPayment from './views/forms/NewPayment';

// components
import TabButton from './components/common/TabButton';

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
              key='modal'
              component={Modal} />
            <Scene
              key='profile'
              component={Profile} />
            <Scene
              key='contestPhotos'
              panHandlers={null}
              component={ContestPhotos} />
            <Scene
              key='contestDetail'
              panHandlers={null}
              direction='vertical'
              component={ContestDetail} />
            <Scene
              key='chat'
              component={Chat} />
            <Scene
              key='settings'
              component={Settings} />
            <Scene
              key='payment'
              component={Payment} />
            <Scene
              key='newPayment'
              component={NewPayment} />
            <Scene
              tabs
              tabBarStyle={styles.tabs}
              key='main'
              type='replace'>
              <Scene
                initial
                hideNavBar
                key='mainMain'
                component={Main}
                title='Home'
                iconName='home'
                icon={TabButton} />
              <Scene
                hideNavBar
                key='mainBroadcast'
                component={NewContest}
                title='Start a Contest'
                iconName='casino'
                icon={TabButton} />
              <Scene
                hideNavBar
                key='mainContestant'
                component={Contestant}
                title='Shoot Away'
                iconName='camera'
                icon={TabButton} />
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
