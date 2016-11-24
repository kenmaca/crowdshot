import {
  Dimensions, Navigator
} from 'react-native';

let Width = Dimensions.get('window').width;
let Height = Dimensions.get('window').height;
let Ratio = (Height*13)/(Width);

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
  H1: Ratio*(0.95),
  H2: Ratio*(3/4),
  H3: Ratio*(9/16),
  H4: Ratio*(1/2),
  Text: Ratio*(4/8),
  SmallText: Ratio*(7/16),

  // padding sizes
  // 25 15
  OuterFrame: 25,
  InnerFrame: 15
};

export default Sizes;
