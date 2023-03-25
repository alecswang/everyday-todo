// Import the functions needed from firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGI0WLp5aa01QQrzNaFllcwQxGdxz5Kng",
  authDomain: "dailyhabittracker-75423.firebaseapp.com",
  projectId: "dailyhabittracker-75423",
  storageBucket: "dailyhabittracker-75423.appspot.com",
  messagingSenderId: "376126065544",
  appId: "1:376126065544:web:e69812eb1783f6b085083d",
  measurementId: "G-6WWJ81LKK8",
  databaseURL: "https://dailyhabittracker-75423-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("log in");
  } else {
    console.log("no user");
  }
});

// event listener for register
document
  .querySelector("#register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let email = document.querySelector("#email-input").value.trim();
    let password = document.querySelector("#password-input").value.trim();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user.uid);
        // window.location.replace("./index.html");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  });

// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

//writeData
// writeUserData(0, "Lanan", []);
// function writeUserData(userId, name, tasks) {
// set(ref(database, 'tasks/'), {
//   username: name,
//   userTasks : tasks
// });
// }
