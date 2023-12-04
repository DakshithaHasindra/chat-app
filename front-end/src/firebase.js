// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbQXL7qvheo14m2pYYGKuR6DfoBmOEcdE",
  authDomain: "chat-app-2-ececf.firebaseapp.com",
  projectId: "chat-app-2-ececf",
  storageBucket: "chat-app-2-ececf.appspot.com",
  messagingSenderId: "643164835165",
  appId: "1:643164835165:web:44f8722ce30dc1ee49ecb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export { auth, app };