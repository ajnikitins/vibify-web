import {Toast} from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/js/all.js'

import './css/custom.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import {postData} from "./js/util";
import UserController from "./js/userController";

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
    this.userController = new UserController(this.app);

    this.refreshButton = document.getElementById('button-refresh');
    this.refreshButton.addEventListener('click', this.onRefreshButtonClick.bind(this));
  }

  onRefreshButtonClick() {
    this.fetchSpotifyApi('/songs').then(data => {
      console.log(data);
    }).catch(err => {
      console.error(err);
    });
  }

  async fetchSpotifyApi(url = '/', data) {
    const response = await postData(`${process.env.BACKEND_URI}/api${url}`, data);

    if (!response.ok) {
      switch (response.status) {
        case 401:
          this.userController.onUserDesync();
          return Promise.reject("User has been desynced");
      }
    } else {
     return response.json();
    }
  }
}

new App();
