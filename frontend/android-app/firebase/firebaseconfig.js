import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCZY_eDu-NgUTPYP5eCUssUHp5VqfS2FXI',
  authDomain: 'entregaflow-3d724.firebaseapp.com',
  projectId: 'entregaflow-3d724',
  storageBucket: 'entregaflow-3d724.firebasestorage.app',
  messagingSenderId: '132341707276',
  appId: '1:132341707276:web:7c7b0c5fdcefb25d787429',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };