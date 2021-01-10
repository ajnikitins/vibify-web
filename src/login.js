import firebase from "firebase/app";
import 'firebase/auth';

const params = new URLSearchParams(window.location.search);

const token = params.get('token');
const config = {
  apiKey: `${process.env.FB_API_KEY}`
};
const app = firebase.initializeApp(config);
app.auth().signInWithCustomToken(token).then(function() {
  window.close();
});
