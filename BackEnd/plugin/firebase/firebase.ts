import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const dotenv = require("dotenv");
dotenv.config();

//-------------------------------- Config FireBase --------------------------------
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

//-------------------------------- Initialized Firebase --------------------------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//-------------------------------- Expose Firebase Storage --------------------------------
const storage = getStorage(app);
export { storage };
