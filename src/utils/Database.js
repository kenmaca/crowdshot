import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyA2lybpyZB4tS50hvObKDrpS3jgnBIjV7E",
  authDomain: "crowdshot-production.firebaseapp.com",
  databaseURL: "https://crowdshot-production.firebaseio.com",
  storageBucket: "crowdshot-production.appspot.com",
  messagingSenderId: "129647293054"
};

export const Firebase = firebase.initializeApp(config);
export const Database = Firebase.database();
export default Database;
