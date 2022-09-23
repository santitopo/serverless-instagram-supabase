import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

export const deleteDocOnCollection = async (collectionName, docId) => {
  const db = getFirestore();

  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { id: docId };
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export default deleteDocOnCollection;
