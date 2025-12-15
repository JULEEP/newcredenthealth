// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Same Firebase configuration use karo
firebase.initializeApp({
  apiKey: "AIzaSyD-PF4YTTP-RhXMy4wsMsS2wWnjQZhqErQ",
  authDomain: "credenthealth-b7477.firebaseapp.com",
  projectId: "credenthealth-b7477",
  storageBucket: "credenthealth-b7477.firebasestorage.app",
  messagingSenderId: "267796339584",
  appId: "1:267796339584:web:68f803765fd2c914c7ff65"
});

const messaging = firebase.messaging();

// Background messages handle karo
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});