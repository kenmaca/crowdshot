import React, {
  Component
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import Database from '../../utils/Database';
import {
  Actions
} from 'react-native-router-flux';

// components
import Photo from '../common/Photo';
import CircleIcon from '../common/CircleIcon';

export default class AwardCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.ref = Database.ref(
      `awards/${
        this.props.awardId
      }`
    );

  }

  componentDidMount() {
    this.listener = this.ref.on('value', data => {
      if (data.exists()) {
        this.setState({
          ...data.val()
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener && this.ref.off('value', this.listener);
  }


  render() {
    return (
      <View style={[
        styles.outline,
        this.props.inCart && this.props.inCart > 0 && {
          borderLeftColor: Colors.Primary
        }
      ]}>
          <TouchableOpacity
            onPress={() => this.props.addToCart(
              this.props.awardId)}
            disabled={this.props.balance < this.state.cost}>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => this.props.showAwardDetail(
                this.props.awardId)}>
              <Photo
                photoId={this.state.photo}
                style={styles.photo} />
            </TouchableOpacity>
            <View style={styles.content}>
              <Text style={[
                styles.status,
                this.props.balance < this.state.cost && {
                  color: Colors.SubduedText
                },
                this.props.inCart && this.props.inCart > 0 && {
                  color: Colors.Primary
                }
              ]}>
                {this.state.name}
              </Text>
              <Text style={[
                  styles.details,
                  this.props.balance < this.state.cost && {
                    color: Colors.SubduedText
                  }
                ]}>
                {this.state.description}
              </Text>
            </View>
            <View style={styles.prizeContainer}>
              <Text style={[
                  styles.prize,
                  this.props.balance < this.state.cost && {
                    color: Colors.SubduedText
                  },
                  this.props.inCart && this.props.inCart > 0 && {
                    color: Colors.Primary
                  }
                ]}>
                {
                  `$${
                    this.state.cost || '0'
                  }`
                }
              </Text>
              <Text style={[
                  styles.prize,
                  this.props.balance < this.state.cost && {
                    color: Colors.SubduedText
                  },
                  this.props.inCart && this.props.inCart > 0 && {
                    color: Colors.Primary
                  }
                ]}>
                {
                  `x${
                    this.props.inCart || '0'
                  }`
                }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outline: {
    alignSelf: 'stretch',
    borderLeftWidth: Sizes.InnerFrame / 4,
    borderLeftColor: Colors.ModalForeground,
    backgroundColor: Colors.ModalForeground
  },

  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: Sizes.InnerFrame,
    paddingLeft: Sizes.InnerFrame,
    backgroundColor: Colors.ModalForeground
  },

  photo: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: Colors.ModalForeground
  },

  content: {
    flex: 1,
    marginLeft: Sizes.InnerFrame / 2,
    justifyContent: 'center'
  },

  status: {
    color: Colors.AlternateText,
    fontWeight: '500'
  },

  details: {
    marginTop: Sizes.InnerFrame / 4,
    fontSize: Sizes.SmallText,
    fontWeight: '100',
    color: Colors.AlternateText
  },

  prizeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },

  prize: {
    fontSize: Sizes.H3,
    fontWeight: '500',
    color: Colors.AlternateText
  },

  statusIcon: {
    marginTop: Sizes.InnerFrame / 2
  }
});


function getTimeLeft(start, end){
  let t = end - start;
  let seconds = Math.floor((t / 1000) % 60);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  let days = Math.floor(t / (1000 * 60 * 60 * 24));

  // build string
  let timeLeft = [
    days > 1 ? `${days} days`: days > 0 ? `${days} day`: '',
    hours > 1 ? `${hours} hours`: hours > 0 ? `${hours} hour`: '',
    minutes > 1 ? `${minutes} minutes`: minutes > 0 ? `${minutes} minute`: '',
    // seconds > 1 ? `${seconds} seconds`: seconds > 0 ? `${seconds} second`: ''
  ];

  // and add oxford comma to the end
  if (timeLeft.length > 1) {
    timeLeft[timeLeft.length - 1] = `and ${timeLeft[timeLeft.length - 1]}`;
  }

  return timeLeft.filter(k => k).join(timeLeft.length > 3 ? ', ': ' ');
}
