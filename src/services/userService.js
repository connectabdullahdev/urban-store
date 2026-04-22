/**
 * Firestore User Service
 * Profile management + Wishlist cloud sync
 */

import firestore from '@react-native-firebase/firestore';

const USERS = 'users';

export const getUserProfile = async uid => {
  const snap = await firestore().collection(USERS).doc(uid).get();
  return snap.exists ? snap.data() : null;
};

export const updateUserProfile = async (uid, data) => {
  await firestore()
    .collection(USERS)
    .doc(uid)
    .set(
      {
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
};

/**
 * Wishlist sync — overwrites the wishlist array for this user
 */
export const saveWishlistToCloud = async (uid, items) => {
  if (!uid) return;
  await firestore().collection(USERS).doc(uid).set(
    {
      wishlist: items,
      wishlistUpdatedAt: firestore.FieldValue.serverTimestamp(),
    },
    {merge: true},
  );
};

export const fetchWishlistFromCloud = async uid => {
  if (!uid) return [];
  const snap = await firestore().collection(USERS).doc(uid).get();
  if (!snap.exists) return [];
  return snap.data().wishlist || [];
};

/**
 * Save completed order for history
 */
export const saveOrder = async (uid, order) => {
  await firestore()
    .collection(USERS)
    .doc(uid)
    .collection('orders')
    .add({
      ...order,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
};
