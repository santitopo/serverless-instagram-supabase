import { getFirestore, collection, addDoc } from "firebase/firestore";

export const addDocToCollection = async (collectionName, doc) => {
  const db = getFirestore();

  try {
    const docRef = await addDoc(collection(db, collectionName), doc);
    return { id: docRef, ...doc };
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default addDocToCollection;
