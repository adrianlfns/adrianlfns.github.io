 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
 //import { getFirestore,addDoc,collection,query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
 import { getAuth, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyDItIlZ0dJZATfcve5lZ4Wi1A2zUWg3DqY",
   authDomain: "scheduler-29b8d.firebaseapp.com",
   projectId: "scheduler-29b8d",
   storageBucket: "scheduler-29b8d.appspot.com",
   messagingSenderId: "1090758164147",
   appId: "1:1090758164147:web:0ab81265ebf4458e323ac6"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth();

 window.Logout = function Logout()
 {
  signOut(auth).then(() => {
     window.location = "login.html"
  }).catch((error) => {
    alert(error)    
  });
  
 }


 window.SignIn =  function SignIn(email, password)
 {

  

signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    // Signed in 
    const user = userCredential.user; 
    window.location = '/index.html';
    // ...
  })
  .catch((error) => {
    alert("Invalid Email/Password");
    const errorCode = error.code;
    const errorMessage = error.message;
  });
 }

 window.validate_field =(field) => {
  if (field == null){
    return false;
  }

  if (File.len <= 0){
    return false;
  }
  return true;
 }

  


 /*
 try {
  const docRef = await addDoc(collection(db, "users"), {
    first: "Ada",
    last: "Lovelace",
    born: 1815
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}*/