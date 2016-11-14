import React, {
  Component
} from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import DateFormat from 'dateformat';

// components
import * as Progress from 'react-native-progress';
import CircleIcon from '../common/CircleIcon';

export default class ContestProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.update(props.start, props.end, props.interval);
  }

  componentWillUnmount() {
    this.progress && clearTimeout(this.progress);
  }

  update(start, end, interval) {

    // clear previous, just in case this was an interrupt
    this.componentWillUnmount();
    let defaultStart = Date.now();
    let defaultEnd = defaultStart + 3600000;
    let duration = (
      parseInt(end || defaultEnd)
      - parseInt(start || defaultStart)
    );
    let elapsed = (
      Date.now()
      - parseInt(start || defaultStart)
    );

    // now update
    this.setState({
      progress: (
        (duration !== 0)
        ? (
          (elapsed < duration)
          ? elapsed / duration
          : 1
        ): 0
      )
    });

    // refresh
    this.progress = setTimeout(
      this.update,
      interval || 20000,
      start,
      end,
      interval
    );
  }

  render() {
    return (
      <TouchableOpacity
        onPress={(
          this.state.progress < 1
          ? this.props.onPressIncomplete
          : this.props.onPressComplete
        )}
        style={styles.container}>
        {
          this.state.progress < 1
          ? (
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressTextEnd}>
                Ending {
                  DateFormat(this.props.end, 'dddd, h:MMTT')
                }
              </Text>
              <View style={styles.progressUpsellContainer}>
                <Text style={styles.progressUpsellText}>
                  ADD AN HOUR
                </Text>
                <CircleIcon
                  style={styles.progressUpsellIcon}
                  size={10}
                  icon='attach-money' />
              </View>
            </View>
          ): (
            <View style={styles.progressUpsellContainer}>
              <Text style={styles.progressUpsellText}>
                CONTEST ENDED — VOTE FOR THE WINNERS
              </Text>
            </View>
          )
        }
        <Progress.Bar
          animated
          progress={this.state.progress}
          width={Sizes.Width - Sizes.InnerFrame * 4}
          color={Colors.Primary}
          unfilledColor={Colors.LightOverlay}
          borderWidth={0} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.OuterFrame,
    backgroundColor: Colors.DarkOverlay,
    minHeight: Sizes.InnerFrame * 6
  },

  progressTextContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

  progressUpsellContainer: {
    padding: Sizes.InnerFrame / 2,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  progressUpsellText: {
    color: Colors.SubduedText,
    fontSize: Sizes.SmallText,
    fontWeight: '700'
  },

  progressStaticText: {
    color: Colors.SubduedText,
    fontSize: Sizes.Text,
    fontWeight: '700'
  },

  progressUpsellIcon: {
    marginLeft: Sizes.InnerFrame / 3,
  },

  progressTextEnd: {
    padding: Sizes.InnerFrame / 2,
    paddingTop: 0,
    color: Colors.SubduedText,
    fontWeight: '700'
  }
});
