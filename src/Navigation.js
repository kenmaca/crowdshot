import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Navigator
} from 'react-native';
import {
  Router, Scene
} from 'react-native-router-flux';
import {
  Colors
} from './Const';

// views
import Login from './views/main/Login';

export default class Navigation extends Component {
  componentDidMount() {
    Platform.OS === 'ios' && StatusBar.setBarStyle('light-content', true);
  }

  render() {
    return (
      <View style={styles.container}>
        <Router
          getSceneStyle={
            (props, computed) => ({
              paddingTop: computed.hideNavBar
                ? 0
                : Navigator.NavigationBar.Styles.General.TotalNavHeight
            })
          }>
          <Scene
            hideNavBar
            key='root'
            navigationBarStyle={styles.nav}
            titleStyle={styles.navText}
            leftButtonIconStyle = {styles.navButtons}
            rightButtonIconStyle = {styles.navButtons}>
            <Scene
              initial
              key='login'
              component={Login}
              type='replace' />
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
  }
});
