import React, {
  Component
} from 'react';
import {
  View, StyleSheet
} from 'react-native';
import {
  Colors, Sizes
} from '../../Const';
import {
  Actions
} from 'react-native-router-flux';
import * as Firebase from 'firebase';
import Database from '../../utils/Database';

// components
import TextEntry from '../forms/TextEntry';

export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // methods
    this.submit = this.submit.bind(this);
  }

  submit(reason) {
    let now = Date.now();

    // first, submit as a chat (so the user can view
    // any responses)
    let reportId = Database.ref('chats').push({
      [now]: {
        '.value': {
          createdBy: Firebase.auth().currentUser.uid,
          message: reason
        },
        '.priority': -now
      }
    }).key;

    // use all value props and pass to report
    let values = Object.assign(
      {},
      ...Object.keys(this.props).filter(
        prop => (

          // no functions
          !(this.props[prop] instanceof Function)

          // no arrays
          && !(this.props[prop] instanceof Array)

          // no objects
          && !(this.props[prop] instanceof Object)
        )
      ).map(

        // build back into array of seperate objects
        prop => ({
          [prop]: this.props[prop]
        })
      )
    );

    // now tag the chat as an associated report
    Database.ref(
      `reports/${
        reportId
      }`
    ).set({
      '.value': Object.assign(
        {
          createdBy: Firebase.auth().currentUser.uid,
          dateCreated: now
        },
        values
      ),
      '.priority': -now
    });
  }

  render() {
    return (
      <TextEntry
        title='Report Inappropriate Behavior'
        label='Description'
        subtitle='Tell us whats wrong?'
        buttonLabel='Submit Report'
        disclaimer={
          'We take all reports very seriously and will try '
          + 'to respond to your concerns within 48 business hours.'
        }
        onSubmit={this.submit}
        {...this.props} />
    );
  }
}
