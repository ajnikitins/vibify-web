import firebase from "firebase/app";
import "firebase/auth";

export default class UserController {
  constructor(app) {
    this.app = app;

    this.loginButton = document.getElementById('button-login');
    this.loginButton.addEventListener('click', this.onLoginButtonClick.bind(this));

    this.logoutButton = document.getElementById('button-logout');
    this.logoutButton.addEventListener('click', this.onLogoutButtonClick.bind(this));

    this.appContainer = document.getElementById('container-app');

    this.userinfoContainer = document.getElementById('container-userinfo');
    this.loginContainer = document.getElementById('container-login');

    this.nameContainer = document.getElementById('text-displayname');
    this.profilePicture = document.getElementById('image-profile');

    this.app.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }

  onAuthStateChanged(user) {
    if (user && user.uid === this.lastUid) return;

    if (user) {
      this.lastUid = user.uid;
      this.user = user;

      this.nameContainer.innerText = user.displayName;
      this.profilePicture.src = user.photoURL;

      this.showLoginOrInfo(false);
    } else {
      this.lastUid = null;

      this.showLoginOrInfo(true);
    }
  }

  onLoginButtonClick() {
    window.open(`${process.env.BACKEND_URI}${process.env.BACKEND_REDIRECT_PATH}`, 'firebaseAuth', 'height=315,width=400');
  }

  onLogoutButtonClick() {
    firebase.auth().signOut();
  }

  showLoginOrInfo(shouldShowLogin) {
    if (shouldShowLogin) {
      if (this.loginContainer.classList.contains('visually-hidden'))
        this.loginContainer.classList.remove('visually-hidden');

      if (!this.userinfoContainer.classList.contains('visually-hidden'))
        this.userinfoContainer.classList.add('visually-hidden');

      if (!this.appContainer.classList.contains('visually-hidden'))
        this.appContainer.classList.add('visually-hidden');
    } else {
      if (!this.loginContainer.classList.contains('visually-hidden'))
        this.loginContainer.classList.add('visually-hidden');

      if (this.userinfoContainer.classList.contains('visually-hidden'))
        this.userinfoContainer.classList.remove('visually-hidden');

      if (this.appContainer.classList.contains('visually-hidden'))
        this.appContainer.classList.remove('visually-hidden');
    }
  }

  onUserDesync() {
    firebase.auth().signOut();
    this.showLoginOrInfo(true);
    //TODO: Add toast that auth state is malformed
  }
}
