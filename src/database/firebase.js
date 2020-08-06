import firebase from "firebase";

const firebaseApp  = firebase.initializeApp({
    
    apiKey: "AIzaSyCQNVhOfGir8pfDd8x4erq7D4JnQ-dVFpg",
    authDomain: "instagram-clone-6d7d5.firebaseapp.com",
    databaseURL: "https://instagram-clone-6d7d5.firebaseio.com",
    projectId: "instagram-clone-6d7d5",
    storageBucket: "instagram-clone-6d7d5.appspot.com",
    messagingSenderId: "840043657664",
    appId: "1:840043657664:web:0b3ac6ec4a5ca018a9f025",
    measurementId: "G-N8SW3MC36K"
});

// const firebaseConfig = {

//   };



const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db, auth, storage};