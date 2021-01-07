import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
// import '@fortawesome/fontawesome-free/css/all.css'

import firebase from 'firebase/app';
import 'firebase/firestore';
import crypto from 'crypto-random-string';
import {createAuthorizationURL} from "./util";

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOM,
  projectId: process.env.FB_PROJ_ID,
  storageBucket: process.env.FB_STOR_BUCK,
  messagingSenderId: process.env.FB_MESS_SEND_ID,
  appId: process.env.FB_APP_ID,
}
const app = firebase.initializeApp(firebaseConfig);

function redirectToSpotify() {
  const state = crypto({length: 10, type: "url-safe"});
  sessionStorage.setItem('state', state);

  const authorizationUri = createAuthorizationURL({
    id: process.env.SPOTIFY_CLIENT_ID,
    host: 'https://accounts.spotify.com',
    path: '/authorize',
    redirect_uri: process.env.REDIRECT_URI,
    scope: ["playlist-modify-private", "user-library-read"],
    state: state,
  });

  console.log(authorizationUri);
  window.location.href = authorizationUri;
}

function main() {
  //TODO: Add authorization code handling
  //TODO: Add error handling for failed authorization

  const buildButton = document.querySelector('button#login_button');
  buildButton.addEventListener('click', redirectToSpotify)
}

main();
