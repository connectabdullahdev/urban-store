/**
 * Firebase Auth service
 * Signup, Login, Logout, Password Reset
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const signUpUser = async ({email, password, displayName}) => {
  const cred = await auth().createUserWithEmailAndPassword(email, password);
  if (displayName) {
    await cred.user.updateProfile({displayName});
  }
  // Create user doc in Firestore
  await firestore().collection('users').doc(cred.user.uid).set({
    email,
    displayName: displayName || '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    wishlist: [],
  });
  return cred.user;
};

export const loginUser = async ({email, password}) => {
  const cred = await auth().signInWithEmailAndPassword(email, password);
  return cred.user;
};

export const logoutUser = async () => {
  await auth().signOut();
};

export const resetPassword = async email => {
  await auth().sendPasswordResetEmail(email);
};

/**
 * Converts raw Firebase error codes into friendly messages
 */
export const friendlyAuthError = code => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
};
