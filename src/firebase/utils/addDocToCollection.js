import { getFirestore, collection, addDoc } from "firebase/firestore";

export const addDocToCollection = async (collectionName, docData) => {
  const db = getFirestore();

  try {
    const docRef = await addDoc(collection(db, collectionName), docData);
    return { id: docRef.id, ...docData };
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default addDocToCollection;
