import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase.js';

export function subscribeAllTasks(callback) {
  const q = query(collection(db, 'Tasks'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(tasks);
  });
}

export async function addTask(data) {
  const docRef = await addDoc(collection(db, 'Tasks'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateTask(id, data) {
  await updateDoc(doc(db, 'Tasks', id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteTask(id) {
  await deleteDoc(doc(db, 'Tasks', id));
}

export async function markSent(id) {
  await updateDoc(doc(db, 'Tasks', id), {
    sent: true,
    sentAt: serverTimestamp()
  });
}

export async function markEmailSent(id) {
  await updateDoc(doc(db, 'Tasks', id), {
    emailSent: true,
    emailSentAt: serverTimestamp()
  });
}