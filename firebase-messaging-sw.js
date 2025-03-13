import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDLKj7DbyCVYzX05evE0I8gQFNzsQwIzzM",
  authDomain: "frame-of-mind-c09e6.firebaseapp.com",
  projectId: "frame-of-mind-c09e6",
  storageBucket: "frame-of-mind-c09e6.firebasestorage.app",
  messagingSenderId: "615124235277",
  appId: "1:615124235277:web:9ab01efa2660334f939144",
  measurementId: "G-YG3DVXRF3S",
};

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();
getToken(messaging, {
  vapidKey:
    "BPPmtlmXr-Wz0BjZ-8hYkw7MIzyqcWu-7rDa22gxs0X1mYH5mP-bbqz95TWTZ4KncUYCyc5RYvWFPar_bAfCPho",
})
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });
