import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBjumJLkClQJxnpRNjNRRw9yPVkrwgYUbs',
  authDomain: 'crowdshot-11ce3.firebaseapp.com',
  databaseURL: 'https://crowdshot-11ce3.firebaseio.com',
  storageBucket: 'crowdshot-11ce3.appspot.com',
  messagingSenderId: '580889623356'
};

export const Firebase = firebase.initializeApp(config);
export const Database = Firebase.database();
export default Database;
