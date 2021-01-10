import {Toast} from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/js/all.js'

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOM,
  projectId: process.env.FB_PROJ_ID,
  storageBucket: process.env.FB_STOR_BUCK,
  messagingSenderId: process.env.FB_MESS_SEND_ID,
  appId: process.env.FB_APP_ID,
}

class App {
  constructor() {
    this.app = firebase.initializeApp(firebaseConfig);

    const toastElList = [].slice.call(document.querySelectorAll('.toast'))
    this.toastList = toastElList.map((toastEl) => new Toast(toastEl));

    this.loginButton = document.getElementById('button-login');

    this.loginButton.addEventListener('click', this.onLoginButtonClick.bind(this));
    this.app.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));

    console.log(this.app.auth().currentUser);
  }

  onLoginButtonClick() {
    window.open(`${process.env.BACKEND_URI}${process.env.BACKEND_REDIRECT_PATH}`, 'firebaseAuth', 'height=315,width=400');
  }

  onAuthStateChanged(user) {
    if (user && user.uid === this.lastUid) return;

    if (user) {
      this.lastUid = user.uid;
      this.user = user;
      //TODO: add user info parsing
      console.log(this.user);
    } else {
      this.lastUid = null;

    }
  }
}

new App();
