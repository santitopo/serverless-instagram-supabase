import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export const updateDocOnCollection = async (collectionName, docId, docData) => {
  const db = getFirestore();

  try {
    await updateDoc(doc(db, collectionName, docId), docData);
    return { id: docId, ...docData };
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export default updateDocOnCollection;
