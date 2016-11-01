import {
  Dimensions, Navigator
} from 'react-native';

export const Sizes = {

  // nav bar height
  NavHeight: Navigator.NavigationBar.Styles.General.TotalNavHeight,

  // screen
  Width: Dimensions.get('window').width,
  Height: Dimensions.get('window').height,

  // text sizes
  H1: 32,
  H2: 24,
  H3: 18,
  H4: 16,
  Text: 12,
  SmallText: 10,

  // padding sizes
  OuterFrame: 25,
  InnerFrame: 15
};

export default Sizes;
