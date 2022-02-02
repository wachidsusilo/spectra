import firebase from 'firebase/app';
import "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import { FIREBASE_CONFIG } from './../constants/constant';
import { setProfile } from './../variables/profile';

firebase.initializeApp(FIREBASE_CONFIG);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        setProfile(user.displayName, user.photoURL, user.uid);
        localStorage.setItem('auth', 'true');
    } else {
        setProfile(null, null, null);
        localStorage.removeItem('auth');
    }
});

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const twitterProvider = new firebase.auth.TwitterAuthProvider();
export const microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
export const githubProvider = new firebase.auth.GithubAuthProvider();
export const auth = firebase.auth();
export const database = firebase.database().ref('users');
export default firebase;
