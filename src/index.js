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

    document.addEventListener('DOMContentLoaded', this.loadElements.bind(this));

    const toastElList = [].slice.call(document.querySelectorAll('.toast'))
    this.toastList = toastElList.map((toastEl) => new Toast(toastEl));
  }

  loadElements() {
    this.loginButton = document.getElementById('button-login');
    this.logoutButton = document.getElementById('button-logout');

    this.userinfoContainer = document.getElementById('container-userinfo');
    this.loginContainer = document.getElementById('container-login');

    this.nameContainer = document.getElementById('text-displayname');
    this.profilePicture = document.getElementById('image-profile');

    this.loginButton.addEventListener('click', this.onLoginButtonClick.bind(this));
    this.logoutButton.addEventListener('click', this.onLogoutButtonClick.bind(this));
    this.app.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }

  onAuthStateChanged(user) {
    if (user && user.uid === this.lastUid) return;

    if (user) {
      this.lastUid = user.uid;
      this.user = user;

      this.nameContainer.innerText = user.displayName;
      this.profilePicture.src = user.photoURL;

      this.loginContainer.classList.replace('d-flex', 'd-none');
      this.userinfoContainer.classList.replace('d-none', 'd-flex');
    } else {
      this.lastUid = null;
      this.loginContainer.classList.replace('d-none', 'd-flex');
      this.userinfoContainer.classList.replace('d-flex', 'd-none');
    }
  }

  onLoginButtonClick() {
    window.open(`${process.env.BACKEND_URI}${process.env.BACKEND_REDIRECT_PATH}`, 'firebaseAuth', 'height=315,width=400');
  }

  onLogoutButtonClick() {
    firebase.auth().signOut();
  }
}

new App();
