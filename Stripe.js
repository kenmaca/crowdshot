const config = {
  apiKey: 'AIzaSyBjumJLkClQJxnpRNjNRRw9yPVkrwgYUbs',
  authDomain: 'crowdshot-11ce3.firebaseapp.com',
  databaseURL: 'https://crowdshot-11ce3.firebaseio.com',
  storageBucket: 'crowdshot-11ce3.appspot.com',
  messagingSenderId: '580889623356'
};
const StripePrivateAPI = 'sk_test_ZajBLN6RSgJ3JJr4TNrQZadF';

// start database
let firebase = require('firebase');
firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword(
  'server@crowdshot.com',
  'GrayHatesLemonade'
).catch(error => {
  console.log(error);
}).then(() => {

  // add billing tokens to Stripe customers
  console.log('Starting Billing Listener..');
  firebase.database().ref('billing').on('child_added', data => {
    console.log(data.val());
  });
});
