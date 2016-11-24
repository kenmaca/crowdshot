import {
  Dimensions, Navigator
} from 'react-native';

let Width = Dimensions.get('window').width;
let Height = Dimensions.get('window').height;
let Ratio = (((Height^2) + (Width^2))^0.5)*0.02;

export const Sizes = {

  // nav bar height
  NavHeight: Navigator.NavigationBar.Styles.General.TotalNavHeight,
  StatusHeight: 20,

  // screen
  Width: Width,
  Height: Height,
  Ratio: Ratio,

  // text sizes
  // 32, 24, 18, 16, 12, 10
  H0: Ratio*(1.4),
  H1: Ratio*(0.95),
  H2: Ratio*(0.9),
  H3: Ratio*(0.7),
  H4: Ratio*(0.65),
  Text: Ratio*(0.53),
  SmallText: Ratio*(0.45),

  // padding sizes
  // 25 15
  OuterFrame: Ratio*(0.9),
  InnerFrame: Ratio*(0.65)
};

export default Sizes;
