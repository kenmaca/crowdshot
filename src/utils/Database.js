import * as firebase from 'firebase';
import {
  Strings
} from '../Const';

export const Firebase = firebase.initializeApp(
  Strings.FirebaseConfig
);
export const Database = Firebase.database();
export default Database;
