
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyAXipeOynlMB2DQe8TLIdN-_nrJO-CSTf8",
    authDomain: "bakenjoy-2f959.firebaseapp.com",
    projectId: "bakenjoy-2f959",
    storageBucket: "bakenjoy-2f959.appspot.com",
    messagingSenderId: "338128690919",
    appId: "1:338128690919:web:fc7a21521a312fb1a80c42",
    measurementId: "G-DB8WTX7Y58"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = true;

// Configure reCAPTCHA
const configureRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier =  new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
            console.log('recaptcha resolved..')
        }
    });
  }
};

export { auth, configureRecaptcha };
