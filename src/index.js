import {Toast} from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/js/all.js'

import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOM,
  projectId: process.env.FB_PROJ_ID,
  storageBucket: process.env.FB_STOR_BUCK,
  messagingSenderId: process.env.FB_MESS_SEND_ID,
  appId: process.env.FB_APP_ID,
}
const app = firebase.initializeApp(firebaseConfig);

const toastElList = [].slice.call(document.querySelectorAll('.toast'))
const toastList = toastElList.map(function (toastEl) {
  return new Toast(toastEl);
})

function onLoginButtonClick() {
  window.open(`${process.env.BACKEND_URI}${process.env.BACKEND_REDIRECT_PATH}`, 'firebaseAuth', 'height=315,width=400');
}

const buildButton = document.querySelector('button#login_button');
buildButton.addEventListener('click', onLoginButtonClick)
